import { __ } from 'riot';
const { defineComponent } = __;

export function component(tagImplementation, name) {
  const { css, template, ...tag } = tagImplementation;
  return defineComponent({ css, template, tag, name})({});
}
