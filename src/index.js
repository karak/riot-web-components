import wrap from './riot-web-component-wrapper';
import hello from './tags/hello.riot';
import kebabCaseTest from './tags/kebab-case-test.riot';

customElements.define('x-hello', wrap(hello));
customElements.define('kebab-case-test', wrap(kebabCaseTest));

document.addEventListener('DOMContentLoaded', function() {
  // Change the message after 2s has passed.
  setTimeout(function() {
    const el = document.querySelector('x-hello');
    el.setAttribute('message', 'Good-bye!');
  }, 2000);
});
