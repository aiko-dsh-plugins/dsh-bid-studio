import { defineTool } from '@deepseek-ai/dsh-tools';
import { BID_ONTOLOGY, CREATE_BID_PROJECT, EXPORT_BID_DOCUMENT, RUN_BID_TO_REVIEW } from "./definition.js";
import { createBidActionHandlers, createBidFunctionHandlers } from "./workflow.js";
export { APPROVE_BID_REVIEW, BID_ACTIONS, BID_OBJECT_TYPES, BID_ONTOLOGY, BID_WORKFLOW, CREATE_BID_PROJECT, EXPORT_BID_DOCUMENT, RUN_BID_TO_REVIEW, } from "./definition.js";
/** Services required by the Host half. */
export const inject = ['ontology', 'tools', 'workflowEngine'];
/** Register the bid ontology, executable adapters, and model entry points. */
export function apply(ctx) {
    ctx.effect(() => ctx.ontology.register(BID_ONTOLOGY, {
        actions: createBidActionHandlers(request => ctx.workflowEngine.start(request)),
        functions: createBidFunctionHandlers(),
    }), 'bid-studio: ontology contribution');
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'bid_create_project',
        description: 'Create a durable local bid project that can be opened in Bid Studio.',
        parameters: {
            name: { type: 'string', required: true, description: 'Bid project name' },
        },
        output: {
            schema: {
                type: 'object',
                properties: {
                    projectId: { type: 'string', required: true },
                    name: { type: 'string', required: true },
                    stage: { type: 'string', required: true },
                },
                additionalProperties: false,
            },
            render: (_args, value) => [{ type: 'text', text: `Created bid project ${value.name} (${value.projectId}) in stage ${value.stage}.` }],
        },
        async execute(args, exec) {
            exec.signal.throwIfAborted();
            const project = await ctx.ontology.executeAction(CREATE_BID_PROJECT, { name: args.name });
            return { projectId: project.id, name: stringProperty(project, 'name'), stage: stringProperty(project, 'stage') };
        },
    })), 'bid-studio: create-project tool');
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'bid_run_to_review',
        description: [
            'Run tender intake, requirement analysis, evidence matching, risk assessment, and response generation,',
            'then stop for human review.',
        ].join(' '),
        parameters: {
            projectId: { type: 'string', required: true, description: 'Opaque bid project id' },
            tenderText: { type: 'string', required: true, description: 'Tender source text with one requirement per line when possible' },
        },
        output: {
            schema: {
                type: 'object',
                properties: {
                    runId: { type: 'string', required: true },
                    status: { type: 'string', required: true },
                    currentStep: { type: 'string', required: true },
                },
                additionalProperties: false,
            },
            render: (_args, value) => [{ type: 'text', text: `Bid workflow ${value.runId} is ${value.status} at ${value.currentStep}. Open Bid Studio for human review.` }],
        },
        async execute(args, exec) {
            exec.signal.throwIfAborted();
            const run = await ctx.ontology.executeAction(RUN_BID_TO_REVIEW, { projectId: args.projectId, tenderText: args.tenderText });
            return { runId: run.id, status: stringProperty(run, 'status'), currentStep: stringProperty(run, 'currentStep') };
        },
    })), 'bid-studio: run-to-review tool');
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'bid_export_document',
        description: 'Export a formal Markdown bid artifact after the project has passed human review in Bid Studio.',
        parameters: {
            projectId: { type: 'string', required: true, description: 'Opaque bid project id' },
        },
        output: {
            schema: {
                type: 'object',
                properties: {
                    artifactId: { type: 'string', required: true },
                    name: { type: 'string', required: true },
                    format: { type: 'string', required: true },
                },
                additionalProperties: false,
            },
            render: (_args, value) => [{ type: 'text', text: `Exported ${value.name} (${value.artifactId}) as ${value.format}.` }],
        },
        async execute(args, exec) {
            exec.signal.throwIfAborted();
            const artifact = await ctx.ontology.executeAction(EXPORT_BID_DOCUMENT, { projectId: args.projectId });
            return { artifactId: artifact.id, name: stringProperty(artifact, 'name'), format: stringProperty(artifact, 'format') };
        },
    })), 'bid-studio: export-document tool');
}
function stringProperty(object, key) {
    const value = object.properties[key];
    return typeof value === 'string' ? value : '';
}
//# sourceMappingURL=index.js.map