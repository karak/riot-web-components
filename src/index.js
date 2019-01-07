import './tags/hello.riot';

document.addEventListener('DOMContentLoaded', function () {
  // Change the message after 2s has passed.
  setTimeout(function () {
    var el = document.querySelector('x-hello');
    el.setAttribute('message', 'Good-bye!');
  }, 2000);
});
