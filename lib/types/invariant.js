const PACKAGE_NAME = 'aiko-dsh-bid-studio';
/** Cordis companion plugin name. */
export const name = 'bid-studio-invariant';
/** Services required before reserving package ownership. */
export const inject = ['invariants'];
// No runtime invariant: the Host contribution is immutable after the
// ontology registry accepts it, while Client slot ownership lives in the
// separate browser runtime.
const install = Object.assign(() => { }, { inject: ['ontology'] });
/** Register this package's invariant companion. */
export const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
/* jscpd:ignore-end */
//# sourceMappingURL=invariant.js.map