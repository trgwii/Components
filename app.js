import { __, div, p } from './Components.js';

const Foo = div(p(__), p(__));
const Bar = div(p(__(x => x + ' apples')))

const foo = Foo.render();
const bar = Foo.render();

const baz = Bar.render();

document.body.appendChild(foo.el);
document.body.appendChild(bar.el);
document.body.appendChild(baz.el);
window.foo = foo;
window.bar = bar;
window.baz = baz;