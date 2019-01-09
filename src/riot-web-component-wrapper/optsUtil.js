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
 * create initial `opts` from current attributes of an element.
 *
 * @param {NamedNodeMap} attributes
 * @returns {Object} mapped opts
 */
export function createInitialOpts(attributes) {
  const opts = {};
  for (let i = 0; i < attributes.length; i += 1) {
    const attr = attributes.item(i);
    const { localName, value } = attr;
    if (!isWhite(localName)) {
      const optName = kebabCase.reverse(localName);
      opts[optName] = value;
    }
  }
  return opts;
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

// TODO: Convert camel case - snake case
