//#region lib/types/invariant.js
const PACKAGE_NAME = "aiko-dsh-bid-studio";
/** Cordis companion plugin name. */
const name = "bid-studio-invariant";
/** Services required before reserving package ownership. */
const inject = ["invariants"];
const install = Object.assign(() => {}, { inject: ["ontology"] });
/** Register this package's invariant companion. */
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
