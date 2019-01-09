import * as riot from 'riot';

function decorate(tag, methods) {
  const onMounted0 = tag.onMounted;
  const onMounted1 = methods.onMounted;
  const onBeforeUnmount0 = tag.onBeforeUnmount;
  const onBeforeUnmount1 = methods.onBeforeUnmount;

  return Object.assign(tag, {
    onMounted: function() {
      if (onMounted0) onMounted0.apply(this, arguments);
      if (onMounted1) onMounted1.apply(this, arguments);
    },
    onBeforeUnmount: function() {
      if (onBeforeUnmount1) onBeforeUnmount1.apply(this, arguments);
      if (onBeforeUnmount0) onBeforeUnmount0.apply(this, arguments);
    }
  });
}

/**
 * generate mount function
 *
 * @param {Object} tagImplementation
 * @returns {function(HTMLElement=): Riot.TagInstance}
 */
function mountBy(tagImplementation) {
  return el => riot.component(tagImplementation).mount(el);
}

/**
 * execute some procedure for each nodes
 * @param {Function} callback
 * @param {String} selector
 * @param {HTMLElement|HTMLDocument|ShadowRoot} context
 * @returns {any[]} return-values mapped
 */
function executeForEach(context, selector, callback) {
  const elements = context.querySelectorAll(selector);
  return Array.prototype.map.call(elements, callback, this);
}

function makeRegistry(selector, tagImplementation, accumMakeMethods) {
  /**
   * make lifecycle methods mixin
   * @param {Array} tags tag storage
   * @returns {{onMounted: onMounted, onBeforeUnmount: onBeforeUnmount}}
   */
  function makeMethods(tags) {
    return {
      onMounted: function() {
        const newTags = executeForEach.apply(this, [
          this.root,
          selector,
          mountBy(tagImplementation)
        ]);
        tags.push(...newTags);
      },
      onBeforeUnmount: function() {
        tags.forEach(x => x.unmount());
      }
    };
  }

  const nextAccumMakeMethods = function(tags) {
    return decorate(accumMakeMethods(tags), makeMethods(tags));
  };

  const registry = function(parentTagImplementation) {
    return decorate(parentTagImplementation, nextAccumMakeMethods([]));
  };

  registry.register = function(selector, tagImplementation) {
    return makeRegistry(selector, tagImplementation, nextAccumMakeMethods);
  };

  return registry;
}

/**
 * A utility function to mount child tags by es2015 module,
 * as keeping global namespace clean.
 *
 * @example
 * ```
 * <tag>
 *   <p>
 *     <x-button>{buttonContent}</x-button>
 *   </p>
 *   <script>
 *   import * as riot from 'riot-scoped';
 *   import button from './x-button.riot';
 *
 *   export default scoped.register('x-button', button)({
 *     buttonContent: 'Push me1'
 *   });
 *   </script>
 * </tag>
 * ```
 *
 * @example
 * Define below for Multiple tags:
 *
 * ```
 * export default scoped.register('x-button', button).register('x-button2', button2)({
 *   ...
 * });
 * ```
 */
export function register(selector, childImplementation) {
  return makeRegistry(selector, childImplementation, () => ({}));
}
