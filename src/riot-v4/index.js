import { component } from 'riot';

export function defineComponent({ css, template, tag }) {
  return component(Object.assign({ css, template }, tag), {
    slots: undefined,
    attributes: {}
  });
}
