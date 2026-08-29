/** Package-owned invariant companion. @module aiko-dsh-bid-studio/invariant */
/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'
const PACKAGE_NAME = 'aiko-dsh-bid-studio'
/** Cordis companion plugin name. */
export const name = 'bid-studio-invariant'
/** Services required before reserving package ownership. */
export const inject = ['invariants']
// No runtime invariant: the Host contribution is immutable after the
// ontology registry accepts it, while Client slot ownership lives in the
// separate browser runtime.
const install: InvariantInstaller = Object.assign(() => {}, { inject: ['ontology'] })
/** Register this package's invariant companion. */
export const apply = (ctx: Context): Promise<() => void> => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
