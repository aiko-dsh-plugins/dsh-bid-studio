/** Bid ontology and executable process definition shared by Host and browser. */
import type { OntologyActionDriver, OntologyActionId, OntologyDefinition, OntologyFunctionId, OntologyLinkTypeId, OntologyObjectTypeId } from 'aiko-dsh-bid-studio/ontology/runtime';
/** Object-type ids owned by the bid plugin. */
export declare const BID_OBJECT_TYPES: {
    readonly project: OntologyObjectTypeId;
    readonly tenderDocument: OntologyObjectTypeId;
    readonly requirement: OntologyObjectTypeId;
    readonly scoreCriterion: OntologyObjectTypeId;
    readonly evidence: OntologyObjectTypeId;
    readonly evidenceMatch: OntologyObjectTypeId;
    readonly risk: OntologyObjectTypeId;
    readonly response: OntologyObjectTypeId;
    readonly task: OntologyObjectTypeId;
    readonly review: OntologyObjectTypeId;
    readonly artifact: OntologyObjectTypeId;
    readonly workflowRun: OntologyObjectTypeId;
    readonly workflowStep: OntologyObjectTypeId;
};
/** Action ids forming the executable bid route. */
export declare const BID_ACTIONS: {
    readonly createProject: OntologyActionId;
    readonly importTender: OntologyActionId;
    readonly analyzeTender: OntologyActionId;
    readonly seedEvidence: OntologyActionId;
    readonly matchEvidence: OntologyActionId;
    readonly assessRisks: OntologyActionId;
    readonly generateResponses: OntologyActionId;
    readonly submitReview: OntologyActionId;
    readonly approveReview: OntologyActionId;
    readonly exportDocument: OntologyActionId;
    readonly runToReview: OntologyActionId;
};
/** Read-only business computations exposed by the bid ontology. */
export declare const BID_FUNCTIONS: {
    readonly requirementsForProject: OntologyFunctionId;
    readonly evidenceCoverage: OntologyFunctionId;
    readonly unresolvedRiskCount: OntologyFunctionId;
};
/** Link-type ids materialized by bid Actions. */
export declare const BID_LINK_TYPES: {
    readonly projectDocument: OntologyLinkTypeId;
    readonly documentRequirement: OntologyLinkTypeId;
    readonly requirementScore: OntologyLinkTypeId;
    readonly requirementMatch: OntologyLinkTypeId;
    readonly evidenceMatch: OntologyLinkTypeId;
    readonly requirementRisk: OntologyLinkTypeId;
    readonly riskTask: OntologyLinkTypeId;
    readonly requirementResponse: OntologyLinkTypeId;
    readonly projectRun: OntologyLinkTypeId;
    readonly runStep: OntologyLinkTypeId;
    readonly runReview: OntologyLinkTypeId;
    readonly projectArtifact: OntologyLinkTypeId;
};
/** Stable shortcut for project creation Consumers. */
export declare const CREATE_BID_PROJECT: OntologyActionId;
/** Stable shortcut for running automated steps to the review gate. */
export declare const RUN_BID_TO_REVIEW: OntologyActionId;
/** Stable shortcut for the human approval Action. */
export declare const APPROVE_BID_REVIEW: OntologyActionId;
/** Stable shortcut for the post-approval export Action. */
export declare const EXPORT_BID_DOCUMENT: OntologyActionId;
/** Stable ids of the persisted business-process steps. */
export type BidWorkflowStepId = 'import' | 'analyze' | 'evidence' | 'match' | 'risk' | 'response' | 'review' | 'export';
/** One step in the installable bid process. */
export interface BidWorkflowStepDefinition {
    readonly id: BidWorkflowStepId;
    readonly label: string;
    readonly description: string;
    readonly driver: OntologyActionDriver;
    readonly action: OntologyActionId;
    readonly produces: readonly OntologyObjectTypeId[];
}
/** Versioned process definition rendered and executed by the bid plugin. */
export interface BidWorkflowDefinition {
    readonly id: string;
    readonly version: number;
    readonly label: string;
    readonly steps: readonly BidWorkflowStepDefinition[];
}
/** Complete route from source intake to an approved export. */
export declare const BID_WORKFLOW: BidWorkflowDefinition;
/** Installable bid ontology: work objects, traceability links, Actions, and review state. */
export declare const BID_ONTOLOGY: OntologyDefinition;
//# sourceMappingURL=definition.d.ts.map