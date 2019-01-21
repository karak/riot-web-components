import { component } from '../riot-v4';
import {
  createInitialProps,
  observeAttributes,
  bindHostAttributes
} from './optsUtil';

/**
 * Create the style node to inject into the shadow DOM
 * @param   {string} css - component css
 * @returns {HTMLElement} style DOM node
 */
function createStyleNode(css) {
  const style = document.createElement('style');
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
      const { css } = tagImplementation;
      this._tag = component(tagImplementation);

      // TODO: expose some methods in _tag definitions

      // create shadowRoot
      this.attachShadow({ mode: 'open' });
      bindHostAttributes(this.shadowRoot);

      // append CSS declaration node
      if (css) this.shadowRoot.appendChild(createStyleNode(css));
    }

    connectedCallback() {
      const initialProps = createInitialProps(this.attributes);

      // mount
      this._tag.mount(this.shadowRoot, {}, initialProps);

      // start sync opts with attributes
      this._stopObserve = observeAttributes(this, newProps => {
        this._tag.update({}, newProps);
      });
    }

    disconnectedCallback() {
      this._stopObserve();
      this._tag.unmount(false);
    }

    // NOTE: This element observes its attributes by `MutationObserver` like Vue.
  };
}
