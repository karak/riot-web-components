
const WHITE_ATTRIBUTES = ["id", "class", "style", "is"];
const EVENT_LISTENER_ATTRIBUTES_REGEX = /^on/;

/** @param {String} localName name of attribute without namespace */
function isWhite(localName) {
  localName = localName.toLowerCase();
  return WHITE_ATTRIBUTES.indexOf(localName) >= 0 ||
    localName.match(EVENT_LISTENER_ATTRIBUTES_REGEX);
}

/**
 * create initial `opts` from current attributes of an element.
 *
 * @param {NamedNodeMap} attributes
 */
function createInitialOpts(attributes) {
  const opts = {};
  for (let i = 0; i < attributes.length; i += 1) {
    const attr = attributes.item(i);
    if (!isWhite(attr.localName)) {
      opts[attr.localName] = attr.value;
    }
  }
  return opts;
}

/**
 * start to observe attributes to sync opts with them.
 *
 * @param {HTMLElement} el - element to observe
 * @param {TagInstance} tagInstance - tag instance to sync
 * @param {Object} scope - binding scope
 * @returns {Function} disconnect function
 */
function observeAttributes(el, tagInstance, scope) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      switch (mutation.type) {
        case "attributes":
          if (!isWhite(mutation.attributeName)) {
            scope.opts[mutation.attributeName] =
              mutation.target.attributes[mutation.attributeName].nodeValue;
          }
          break;
      }
    });
    tagInstance.update(scope);
  });

  observer.observe(el, { attributes: true });

  return () => observer.disconnect();
}

export function startSync(scope, el, t) {
  // initialize opts from attributes,
  scope.opts = createInitialOpts(el.attributes);

  // and observe later change.
  const stopObserve = observeAttributes(el, t, scope);
  return stopObserve;
}

// TODO: Convert camel case - snake case
