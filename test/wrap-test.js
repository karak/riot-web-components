import kebabCaseAttributes from './tags/kebab-case-attributes.riot';
import { withCustomTag } from './helpers';

describe('wrap', () => {
  it('convert kebab-case attributes', () => {
    withCustomTag(kebabCaseAttributes, root => {
      root.setAttribute('text-content', 'Changed!');
      //console.log(root.outerHTML);
      //console.log(root.shadowRoot.innerHTML);
      expect(root.shadowRoot.textContent).toBe('Changed!');
      // => NOW fail!
    });
  });
});
