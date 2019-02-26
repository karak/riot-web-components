import { component } from '../src/riot-v4';
import wrap from '../src/riot-web-component-wrapper/wrap';
import uuid from 'uuid';

export function withCustomTag(tagImplementation, callback) {
  const tagName = 'x-' + uuid();
  window.customElements.define(tagName, wrap(tagImplementation));
  return withDom(tagName, root => {
    return callback(root, tagName);
  });
}

export function withTag(tagImplementation, callback) {
  return withDom(root => {
    const tag = component(tagImplementation);
    tag.mount(root); // BUG: onMounted() didn't called!?
    try {
      return callback(tag, root);
    } finally {
      tag.unmount(true);
    }
  });
}

function withDom(tagName, callback) {
  if (arguments.length < 2) {
    callback = tagName;
    tagName = 'span';
  }
  const root = document.createElement(tagName);
  document.body.appendChild(root);
  try {
    return callback(root);
  } finally {
    document.body.removeChild(root);
  }
}
