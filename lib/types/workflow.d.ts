/** Executable local validation adapters for the standard bid process. */
import type { OntologyActionHandlers, OntologyFunctionHandlers } from 'aiko-dsh-ontology-kernel/runtime';
import type { WorkflowRun, WorkflowStartRequest } from '@deepseek-ai/dsh-workflow';
type StartWorkflow = (request: WorkflowStartRequest) => WorkflowRun;
/**
 * Build all Action adapters used by the local validation composition.
 * @param startWorkflow - Starts the generic workflow run that coordinates the Actions.
 * @returns Adapter map for one ontology definition registration.
 */
export declare function createBidActionHandlers(startWorkflow: StartWorkflow): OntologyActionHandlers;
/**
 * Register read-only calculations separately from state-changing Actions.
 * @returns Function adapter map for one ontology definition registration.
 */
export declare function createBidFunctionHandlers(): OntologyFunctionHandlers;
export {};
//# sourceMappingURL=workflow.d.ts.map