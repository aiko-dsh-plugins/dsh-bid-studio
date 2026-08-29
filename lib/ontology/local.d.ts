import { Service } from '@deepseek-ai/cordis';
import OntologyRuntime, { OntologyLinkId, type CreateOntologyLinkRequest, type CreateOntologyObjectRequest, type OntologyActionId, type OntologyDefinition, type OntologyFunctionId, type OntologyFunctionValue, type OntologyImplementation, type OntologyLink, type OntologyLinkQuery, type OntologyObject, type OntologyObjectTypeId, type OntologyPropertyValue, type UpdateOntologyObjectRequest } from 'aiko-dsh-bid-studio/ontology/runtime';
/** In-process ontology runtime for a single desktop Harness host. */
export declare class LocalOntologyRuntime extends OntologyRuntime {
    static inject: string[];
    private readonly definitionsById;
    private readonly objectTypes;
    private readonly linkTypes;
    private readonly functions;
    private readonly actions;
    private readonly objects;
    private readonly links;
    private objectTable?;
    private linkTable?;
    /** Open durable storage and rebuild the immutable object cache before activation. */
    protected [Service.init](): Promise<void>;
    /** Register and validate one hot-reloadable definition contribution. */
    register(definition: OntologyDefinition, implementation?: OntologyImplementation): () => void;
    /** Snapshot all active definitions in registration order. */
    definitions(): readonly OntologyDefinition[];
    /** Create and validate one immutable in-memory object. */
    createObject(request: CreateOntologyObjectRequest): Promise<OntologyObject>;
    /** Merge a validated property patch and persist the replacement snapshot. */
    updateObject(request: UpdateOntologyObjectRequest): Promise<OntologyObject>;
    /** Validate and materialize an object inside the asynchronous service call. */
    private createObjectNow;
    /** List immutable object snapshots, optionally restricted to one type. */
    listObjects(type?: OntologyObjectTypeId): readonly OntologyObject[];
    /** Create and persist one validated graph edge. */
    createLink(request: CreateOntologyLinkRequest): Promise<OntologyLink>;
    /** Delete one stored graph edge. */
    deleteLink(id: OntologyLinkId): Promise<boolean>;
    /** List immutable graph edges matching every supplied filter. */
    listLinks(query?: OntologyLinkQuery): readonly OntologyLink[];
    /** Execute one registered read-only Function and validate its result. */
    executeFunction(functionId: OntologyFunctionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<OntologyFunctionValue>;
    /** Execute one action through its declared provider route. */
    executeAction(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<unknown>;
    private requireObjectTable;
    private requireLinkTable;
    private readContext;
}
export default LocalOntologyRuntime;
//# sourceMappingURL=index.d.ts.map