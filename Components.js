import { Construct } from './Type.js';

export const [
	DeferredArgument,
	hasDeferredArgument,
	isDeferredArgument
] = Construct('deferred argument');

export const [
	PlaceholderElement,
	hasPlaceholderElement,
	isPlaceholderElement
] = Construct('placeholder element');

export const __ = DeferredArgument(body =>
	DeferredArgument({
		[typeof body === 'function' ? 'mapper' : 'default']: body
	}));

const undefer = x =>
	isDeferredArgument(x)
		? x === __ ? '' : (x.default || x.mapper(''))
		: isPlaceholderElement(x)
			? x.render()
			: x;

const Element = x => x;

const append = (el, children) => (
	console.log(el, children),
	children.forEach(child =>
		typeof child === 'string' ? el.appendChild(new Text(child)) :
		Array.isArray(child) ? append(el, child) :
		child.el || child instanceof HTMLElement
			? el.appendChild(child.el)
			: append(el, [
				'default' in child
					? child.default
					: 'mapper' in child
						? child.mapper('')
						: child
			])),
	el);

const elem = name => (...children) =>
	hasDeferredArgument(children) || hasPlaceholderElement(children)
		// placeholder element / component
		? PlaceholderElement({
			render: () => {
				const realChildren = children.map(undefer);
				const el = elem(name)(realChildren);
				const update = (...args) => {
					let n = 0;
					return children.forEach((child, i) => {
						console.log(child);
						if (isDeferredArgument(child)) {
							if (typeof realChildren[i] === 'string') {
								return typeof args[n] === 'string'
									? el.textContent = args[n++]
									: el.children[i]
										? el.replaceChild(new Text(args[n++]), el.children[i])
										: el.appendChild(new Text(args[n++]));
							}
							return append(realChildren[i].el || realChildren[i], [ args[n++] || '' ]);
						}
						if (isPlaceholderElement(child)) {
							console.log('updating', realChildren[i], 'with', args[n]);
							return realChildren[i].update(args[n++] || '');
						}
					});
				};
				return { el, update };
			}
		})
		// normal element
		: Element(append(document.createElement(name), children));

export const div = elem('div');
export const p = elem('p');
