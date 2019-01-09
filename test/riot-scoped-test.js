import inner from './tags/inner.riot';
import outer from './tags/outer.riot';
import { withTag } from './helpers';

describe('riot-scoped', () => {
  it('should mount inner only', () => {
    withTag(inner, tag => {
      expect(tag.root.textContent.trim()).toBe('Inner tag');
    });
  });

  it('should bind nested tag', () => {
    withTag(outer, tag => {
      const inner = tag.root.querySelector('inner');
      expect(inner.textContent.trim()).toBe('Inner tag');
    });
  });
});
