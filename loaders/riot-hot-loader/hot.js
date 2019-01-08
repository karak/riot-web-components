/**
 * @desc
 * webpack HMR for riot@4
 *
 * this module mimics "react-hot-loader".
 */

/* globals */
const hotModules = {
};

/* eslint-disable camelcase, no-undef */
const requireIndirect =
  typeof __webpack_require__ !== 'undefined' ? __webpack_require__ : require
/* eslint-enable */

class HotModule {
  constructor(moduleId) {
    this.moduleId = moduleId;
    this.instances = [];
  }

  addInstance(tagInstance) {
    this.instances.push(tagInstance);
  }

  removeInstance(tagInstance) {
    this.instances.splice(this.instances.indexOf(tagInstance), 1)
  }

  reload() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      console.log(`[RHL] reload a module "${this.moduleId}"`);
      requireIndirect(this.moduleId);
      console.log(`[RHL] updating ${this.instances.length} tag(s)...`);
      this.instances.forEach(inst => {
        // TODO: impl
        // unmount
        // replace tagModule
        // remount with current opts
      })
    });
  }
}

function emptyFn() {}

function createProxyTag(tagImplementation, hotModule) {
  const tag = tagImplementation.tag || {};
  const origianlOnMounted = tag.onMounted || emptyFn;
  tag.onMounted = function () {
    console.log('[RHL] handler onMounted()');
    origianlOnMounted.apply(this, arguments);
    hotModule.addInstance(this)
  };

  const originalOnBeforeUnmount = tag.onBeforeUnmount || emptyFn;
  tag.onBeforeUnmount = function () {
    console.log('[RHL] handler onBeforeUnmount()');
    hotModule.removeInstance(this);
    originalOnBeforeUnmount.apply(this, arguments);
  };

  return tagImplementation
}


/**
 *
 * @param {Module} tagModule compiled tag module
 * @returns {Object} compiled tag with HMR
 */
export default function hot(tagModule) {
  const moduleId = tagModule.id;
  let hotModule;
  if (moduleId in hotModules) {
    hotModule = hotModules[moduleId];
  } else {
    hotModule = hotModules[moduleId] = new HotModule(moduleId);
  }

  // make hot export
  if (tagModule.hot) {
    tagModule.hot.accept((err) => {
      if (err) {
        console.error(err);
      }
    });
    if (tagModule.hot.data) {
      hotModule.reload();
    }
  }

  return (tagImplementation) => {
    return createProxyTag(tagImplementation, hotModule);
  };
}
