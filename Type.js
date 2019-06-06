
export const Construct = name => {
	const Sym = Symbol(name);
	const Type = x => Object.assign(x, { type: Sym });
	const is = x => x && x.type === Sym;
	const has = x => (console.log(x),
		is(x) ||
		typeof x === 'string' ? false :
		(Array.isArray(x) ? x.some(has) :
		[ ...Object.values(x) ].some(has)));
	return [ Type, has, is ];
};
