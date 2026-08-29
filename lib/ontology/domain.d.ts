import type { OntologyLink, OntologyLinkId, OntologyObject, OntologyObjectId } from 'aiko-dsh-bid-studio/ontology/runtime';
/** Storage declaration for provider-owned ontology records. */
export declare const ontologyDomainSpec: {
    name: string;
    version: number;
    tables: {
        objects: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<OntologyObjectId, OntologyObject>;
        links: import("@deepseek-ai/dsh-storage-domain").DomainTableSpec<OntologyLinkId, OntologyLink>;
    };
};
//# sourceMappingURL=domain.d.ts.map