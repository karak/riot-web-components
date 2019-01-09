import { component as defineRiotComponent } from "riot";
import { createInitialOpts, observeAttributes } from "./optsUtil";

/**
 * Create the style node to inject into the shadow DOM
 * @param   {string} css - component css
 * @returns {HTMLElement} style DOM node
 */
function createStyleNode(css) {
  const style = document.createElement("style");
  style.textContent = css;

  return style;
}

/**
 *
 * @param {Module|Object} tagModule
 * @returns {{ new () => HTMLElement}} custom element class
 */
export default function wrap(tagModule) {
  // unwrap es6 module
  const tagImplementation =
    tagModule.__esModule && tagModule.default ? tagModule.default : tagModule;

  return class CustomElement extends HTMLElement {
    constructor(...args) {
      super(...args);

      // create anonymous component
      const { css, template, tag } = tagImplementation;
      this._tag = defineRiotComponent(
        { css, template, ...tag },
        { slots: undefined, attributes: {} }
      );

      // TODO: expose some methods in _tag definitions

      // create shadowRoot
      this.attachShadow({ mode: "open" });
      this.shadowRoot.attributes = []; // stub attributes, always empty, which Riot.Component required.

      // append CSS declaration node
      if (css) this.shadowRoot.appendChild(createStyleNode(css));
    }

    connectedCallback() {
      const initialOpts = createInitialOpts(this.attributes);

      // mount
      this._tag.opts = initialOpts;
      this._tag.mount(this.shadowRoot);
      // `this._tag.mount(this.shadowRoot, {}, initialOpts)` doesn't work with current compiler requiring 'opts'.

      // start sync opts with attributes
      this._stopObserve = observeAttributes(this, newOpts => {
        Object.assign(this._tag.opts, newOpts);
        this._tag.update();
      });
    }

    disconnectedCallback() {
      this._stopObserve();
      this._tag.unmount(false);
    }

    // NOTE: This element observes its attributes by `MutationObserver` like Vue.
  };
}
