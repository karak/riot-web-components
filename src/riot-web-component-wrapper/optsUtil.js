import kebabCase from 'kebab-case';
const WHITE_ATTRIBUTES = ['id', 'class', 'style', 'is'];
const EVENT_LISTENER_ATTRIBUTES_REGEX = /^on/;

/** @param {String} localName name of attribute without namespace */
function isWhite(localName) {
  localName = localName.toLowerCase();
  return (
    WHITE_ATTRIBUTES.indexOf(localName) >= 0 ||
    localName.match(EVENT_LISTENER_ATTRIBUTES_REGEX)
  );
}

/**
 * create initial `props` from current attributes of an element.
 *
 * @param {NamedNodeMap} attributes
 * @returns {Object} mapped props
 */
export function createInitialProps(attributes) {
  const props = {};
  for (let i = 0; i < attributes.length; i += 1) {
    const attr = attributes.item(i);
    const { localName, value } = attr;
    if (!isWhite(localName)) {
      const propName = kebabCase.reverse(localName);
      props[propName] = value;
    }
  }
  return props;
}

/**
 * start to observe attributes to sync opts with them.
 *
 * @param {HTMLElement} el - element to observe
 * @param {Function} calllback - callback
 * @returns {Function} disconnect function
 */
export function observeAttributes(el, callback) {
  const newProps = {};
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const { type, attributeName } = mutation;
      switch (type) {
        case 'attributes':
          if (!isWhite(attributeName)) {
            const optName = kebabCase.reverse(attributeName);
            newProps[optName] =
              mutation.target.attributes[attributeName].nodeValue;
          }
          break;
      }
    });
    callback(newProps);
  });

  observer.observe(el, { attributes: true });

  return () => observer.disconnect();
}

/*********************************************************/

function bindValueAttribute(shadowRoot, host, name) {
  Object.defineProperty(shadowRoot, name, {
    get: function() {
      return host[name];
    }
  });
}

function bindFunctionAttribute(shadowRoot, host, name) {
  Object.defineProperty(shadowRoot, name, {
    value: function() {
      return host[name].apply(host, arguments);
    }
  });
}

/**
 * add some proxy properties to shadowRoot for dom-bindings
 *
 * @param {ShadowRoot} shadowRoot target shadowRoot
 */
export function bindHostAttributes(shadowRoot) {
  const host = shadowRoot.host;

  bindValueAttribute(shadowRoot, host, 'attributes');
  bindFunctionAttribute(shadowRoot, host, 'getAttribute');
  bindFunctionAttribute(shadowRoot, host, 'setAttribute');
}
