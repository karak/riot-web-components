/**
 *
 * @param {Module|Object} tagModule
 * @returns {{ css: string|null, tmpl: string }}
 */
export default function wrap(tagModule) {
  const tagImplementation = tagModule.__esModule && tagModule.default ? tagModule.default : tagModule;
  const {css, tag, template} = tagImplementation;
  const {onMounted, ...rest} = tag;
  return {
    css,
    tmpl: template,
    onMounted() {
      // TODO: initial sync opts with attributes
      if (onMounted) {
        onMounted.apply(this, arguments);
      }
    },
    ...rest
  };

  // TODO: observe attributes by define of `props()` or by using `MutationObserver` like Vue
}
