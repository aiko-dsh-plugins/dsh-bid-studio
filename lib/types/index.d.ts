/** Bid Studio Host plugin: complete bid ontology, process adapters, and conversation tools. */
import type { Context } from '@deepseek-ai/cordis';
export { APPROVE_BID_REVIEW, BID_ACTIONS, BID_OBJECT_TYPES, BID_ONTOLOGY, BID_WORKFLOW, CREATE_BID_PROJECT, EXPORT_BID_DOCUMENT, RUN_BID_TO_REVIEW, } from './definition.ts';
/** Services required by the Host half. */
export declare const inject: string[];
/** Register the bid ontology, executable adapters, and model entry points. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map