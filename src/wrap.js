import {
  template as buildTemplate,
  expressionTypes,
  bindingTypes
} from "@riotjs/dom-bindings";

import { startSync } from "optsUtil";

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
  const tagImplementation =
    tagModule.__esModule && tagModule.default ? tagModule.default : tagModule;
  const { css, tag, template } = tagImplementation;

  return class CustomElement extends HTMLElement {
    constructor(...args) {
      super(...args);

      // TODO: expose tag APIs.

      this.shadow = this.attachShadow({ mode: "open" });
      if (css) this.shadow.appendChild(createStyleNode(css));
    }

    connectedCallback() {
      // create tag instance
      const t = template(
        buildTemplate,
        expressionTypes,
        bindingTypes,
        () => tagImplementation
      );

      // create scope (t itself???)
      const scope = {};

      // add tag APIs
      Object.assign(scope, tag);

      // start sync opts with attributes
      this._stopObserve = startSync(scope, this, t);

      // mount
      this.tag = t.mount(this.shadow, scope);
    }

    disconnectedCallback() {
      this._stopObserve();
      this.tag.unmount();
    }

    // TODO: support lifecycle methods

    // NOTE: This element observes its attributes by `MutationObserver` like Vue.
  };
}
