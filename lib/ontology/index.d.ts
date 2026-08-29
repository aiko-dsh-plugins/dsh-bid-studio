/** Browser-safe Remote projection of the active ontology Provider. */
import type { Context } from '@deepseek-ai/cordis';
import type { OntologyActionId, OntologyDefinition, OntologyFunctionId, OntologyFunctionValue, OntologyLink, OntologyLinkQuery, OntologyObject, OntologyObjectTypeId, OntologyPropertyValue } from 'aiko-dsh-bid-studio/ontology/types';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Remote-safe ontology reads and Action dispatch. */
        ontologyRemote: OntologyRemote;
    }
}
/** Remote Consumer that keeps transport concerns out of the Provider interface. */
export declare class OntologyRemote extends TypertRemoteService {
    static inject: string[];
    constructor(ctx: Context);
    /**
     * Return every active versioned definition.
     * @returns Active definitions in registration order.
     */
    definitions(): readonly OntologyDefinition[];
    /**
     * Return current object snapshots.
     * @param type - Optional object-type filter.
     * @returns Matching immutable objects.
     */
    listObjects(type?: OntologyObjectTypeId): readonly OntologyObject[];
    /**
     * Return current link snapshots.
     * @param query - Optional endpoint and type filters.
     * @returns Matching immutable links.
     */
    listLinks(query?: OntologyLinkQuery): readonly OntologyLink[];
    /**
     * Execute one registered read-only Function.
     * @param functionId - Function id.
     * @param input - Scalar Function fields.
     * @returns Validated Function result.
     */
    executeFunction(functionId: OntologyFunctionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<OntologyFunctionValue>;
    /**
     * Execute one registered Action through the Provider's declared route.
     * @param action - Action id.
     * @param input - Scalar Action fields.
     * @returns Object created or returned by the Action.
     */
    executeAction(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<OntologyObject>;
}
export default OntologyRemote;
//# sourceMappingURL=index.d.ts.map