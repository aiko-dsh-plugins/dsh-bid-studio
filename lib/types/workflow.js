import { BID_ACTIONS, BID_FUNCTIONS, BID_LINK_TYPES, BID_OBJECT_TYPES, BID_WORKFLOW } from "./definition.js";
const BID_WORKFLOW_SCRIPT = `
for (const stepId of args.steps) {
  await activity('bid.execute-step', { stepId })
}
await activity('bid.submit-review', {})
return await activity('bid.finish-review', {})
`;
const EVIDENCE_CATALOG = [
    { title: 'ISO 9001 质量管理体系认证', category: '资格', summary: '公司质量管理体系认证处于有效期内。', source: '企业资质库/ISO9001.pdf', keywords: '资质|认证|ISO|质量体系' },
    { title: '城市数据平台建设案例', category: '技术', summary: '已交付同类型城市数据治理与共享交换平台。', source: '企业案例库/城市数据平台.md', keywords: '案例|数据平台|数据治理|共享交换' },
    { title: '数据平台技术团队履历', category: '技术', summary: '核心团队覆盖架构、数据治理、安全和项目管理。', source: '企业人员库/核心团队.md', keywords: '团队|人员|架构师|项目经理|技术' },
    { title: '标准项目实施与交付方案', category: '交付', summary: '覆盖启动、调研、开发、试运行、验收和移交。', source: '企业方案库/实施交付.md', keywords: '实施|交付|工期|验收|培训' },
    { title: '三级售后服务保障方案', category: '服务', summary: '提供 7×24 服务台、分级响应和现场支持。', source: '企业方案库/售后服务.md', keywords: '售后|服务|响应|运维|保障' },
];
/**
 * Build all Action adapters used by the local validation composition.
 * @param startWorkflow - Starts the generic workflow run that coordinates the Actions.
 * @returns Adapter map for one ontology definition registration.
 */
export function createBidActionHandlers(startWorkflow) {
    const handlers = {
        [BID_ACTIONS.createProject]: createProject,
        [BID_ACTIONS.importTender]: importTender,
        [BID_ACTIONS.analyzeTender]: analyzeTender,
        [BID_ACTIONS.seedEvidence]: seedEvidence,
        [BID_ACTIONS.matchEvidence]: matchEvidence,
        [BID_ACTIONS.assessRisks]: assessRisks,
        [BID_ACTIONS.generateResponses]: generateResponses,
        [BID_ACTIONS.submitReview]: submitReview,
        [BID_ACTIONS.approveReview]: approveReview,
        [BID_ACTIONS.exportDocument]: exportDocument,
    };
    handlers[BID_ACTIONS.runToReview] = async (input, ontology) => await runToReview(input, ontology, handlers, startWorkflow);
    return handlers;
}
/**
 * Register read-only calculations separately from state-changing Actions.
 * @returns Function adapter map for one ontology definition registration.
 */
export function createBidFunctionHandlers() {
    return {
        [BID_FUNCTIONS.requirementsForProject]: (input, ontology) => Promise.resolve(objectsForProject(ontology, BID_OBJECT_TYPES.requirement, requiredString(input, 'projectId'))),
        [BID_FUNCTIONS.evidenceCoverage]: (input, ontology) => {
            const projectId = requiredString(input, 'projectId');
            const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, projectId);
            if (requirements.length === 0)
                return Promise.resolve(0);
            const matchedRequirementIds = new Set(objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, projectId)
                .map(match => stringProperty(match, 'requirementId')));
            return Promise.resolve(matchedRequirementIds.size / requirements.length);
        },
        [BID_FUNCTIONS.unresolvedRiskCount]: (input, ontology) => Promise.resolve(objectsForProject(ontology, BID_OBJECT_TYPES.risk, requiredString(input, 'projectId'))
            .filter(risk => !booleanProperty(risk, 'resolved')).length),
    };
}
const createProject = async (input, ontology) => {
    const name = requiredString(input, 'name');
    return await ontology.createObject({ type: BID_OBJECT_TYPES.project, properties: { name, stage: '资料准备' } });
};
const importTender = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const existing = objectsForProject(ontology, BID_OBJECT_TYPES.tenderDocument, project.id)[0];
    if (existing !== undefined)
        return existing;
    const content = requiredString(input, 'content');
    if (content.length < 20)
        throw new Error('bid-studio: tenderText must contain at least 20 characters');
    const title = optionalString(input, 'title') ?? `${stringProperty(project, 'name')}招标文件`;
    const document = await ontology.createObject({
        type: BID_OBJECT_TYPES.tenderDocument,
        properties: { projectId: project.id, title, sourceName: '工作台文本输入', content, status: '已导入' },
    });
    await ontology.createLink({ type: BID_LINK_TYPES.projectDocument, from: project.id, to: document.id });
    await ontology.updateObject({ id: project.id, properties: { stage: '解析中' } });
    return document;
};
const analyzeTender = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const existing = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
    if (existing[0] !== undefined)
        return existing[0];
    const document = objectsForProject(ontology, BID_OBJECT_TYPES.tenderDocument, project.id)[0];
    if (document === undefined)
        throw new Error(`bid-studio: project '${project.id}' has no tender document`);
    const lines = tenderLines(stringProperty(document, 'content'));
    let first;
    for (const line of lines) {
        const score = scoreFrom(line.text);
        const requirement = await ontology.createObject({
            type: BID_OBJECT_TYPES.requirement,
            properties: {
                projectId: project.id,
                documentId: document.id,
                title: line.text,
                category: classifyRequirement(line.text),
                source: `文本第 ${line.number} 行`,
                mandatory: /必须|不得|应当|须|不低于|不少于/.test(line.text),
                ...(score === undefined ? {} : { score }),
                status: '待匹配',
            },
        });
        await ontology.createLink({ type: BID_LINK_TYPES.documentRequirement, from: document.id, to: requirement.id });
        first ??= requirement;
        if (score !== undefined) {
            const criterion = await ontology.createObject({
                type: BID_OBJECT_TYPES.scoreCriterion,
                properties: { projectId: project.id, requirementId: requirement.id, title: line.text, score, source: `文本第 ${line.number} 行` },
            });
            await ontology.createLink({ type: BID_LINK_TYPES.requirementScore, from: requirement.id, to: criterion.id });
        }
    }
    if (first === undefined)
        throw new Error('bid-studio: tender document contains no analyzable requirement lines');
    await ontology.updateObject({ id: document.id, properties: { status: '已解析' } });
    return first;
};
const seedEvidence = async (_input, ontology) => {
    const existing = ontology.listObjects(BID_OBJECT_TYPES.evidence);
    let first = existing[0];
    for (const record of EVIDENCE_CATALOG) {
        if (existing.some(candidate => stringProperty(candidate, 'title') === record.title))
            continue;
        const created = await ontology.createObject({ type: BID_OBJECT_TYPES.evidence, properties: record });
        first ??= created;
    }
    if (first === undefined)
        throw new Error('bid-studio: evidence catalog did not produce any record');
    return first;
};
const matchEvidence = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
    const evidence = ontology.listObjects(BID_OBJECT_TYPES.evidence);
    if (requirements.length === 0)
        throw new Error(`bid-studio: project '${project.id}' has no requirements`);
    let first;
    for (const requirement of requirements) {
        const existing = objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, project.id)
            .filter(candidate => stringProperty(candidate, 'requirementId') === requirement.id);
        if (existing[0] !== undefined) {
            first ??= existing[0];
            continue;
        }
        const selected = selectEvidence(requirement, evidence);
        if (selected === undefined)
            continue;
        const matched = await ontology.createObject({
            type: BID_OBJECT_TYPES.evidenceMatch,
            properties: {
                projectId: project.id,
                requirementId: requirement.id,
                evidenceId: selected.evidence.id,
                confidence: selected.confidence,
                rationale: selected.rationale,
                status: '已确认',
            },
        });
        await ontology.createLink({ type: BID_LINK_TYPES.requirementMatch, from: requirement.id, to: matched.id });
        await ontology.createLink({ type: BID_LINK_TYPES.evidenceMatch, from: selected.evidence.id, to: matched.id });
        first ??= matched;
        await ontology.updateObject({ id: requirement.id, properties: { status: '已匹配' } });
    }
    await ontology.updateObject({ id: project.id, properties: { stage: '证据匹配' } });
    return first ?? project;
};
const assessRisks = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
    const matches = objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, project.id);
    const risks = objectsForProject(ontology, BID_OBJECT_TYPES.risk, project.id);
    let first = risks[0];
    for (const requirement of requirements) {
        if (matches.some(candidate => stringProperty(candidate, 'requirementId') === requirement.id))
            continue;
        const existing = risks.find(candidate => stringProperty(candidate, 'requirementId') === requirement.id);
        if (existing !== undefined) {
            first ??= existing;
            continue;
        }
        const mandatory = booleanProperty(requirement, 'mandatory');
        const risk = await ontology.createObject({
            type: BID_OBJECT_TYPES.risk,
            properties: {
                projectId: project.id,
                requirementId: requirement.id,
                title: `证据缺口：${stringProperty(requirement, 'title')}`,
                reason: '企业证据库中没有达到自动匹配阈值的材料。',
                severity: mandatory ? '高' : '中',
                resolved: false,
            },
        });
        first ??= risk;
        const task = await ontology.createObject({
            type: BID_OBJECT_TYPES.task,
            properties: { projectId: project.id, riskId: risk.id, title: `补充材料：${stringProperty(requirement, 'title')}`, owner: '投标负责人', status: '待处理' },
        });
        await ontology.createLink({ type: BID_LINK_TYPES.requirementRisk, from: requirement.id, to: risk.id });
        await ontology.createLink({ type: BID_LINK_TYPES.riskTask, from: risk.id, to: task.id });
        await ontology.updateObject({ id: requirement.id, properties: { status: '存在缺口' } });
    }
    return first ?? project;
};
const generateResponses = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
    const matches = objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, project.id);
    const evidence = ontology.listObjects(BID_OBJECT_TYPES.evidence);
    const risks = objectsForProject(ontology, BID_OBJECT_TYPES.risk, project.id);
    let first = objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id)[0];
    for (const requirement of requirements) {
        const existing = objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id)
            .find(candidate => stringProperty(candidate, 'requirementId') === requirement.id);
        if (existing !== undefined) {
            first ??= existing;
            continue;
        }
        const requirementMatches = matches.filter(candidate => stringProperty(candidate, 'requirementId') === requirement.id);
        const evidenceTitles = requirementMatches.map(match => evidence.find(candidate => candidate.id === stringProperty(match, 'evidenceId')))
            .filter((candidate) => candidate !== undefined)
            .map(candidate => stringProperty(candidate, 'title'));
        const risk = risks.find(candidate => stringProperty(candidate, 'requirementId') === requirement.id);
        const response = await ontology.createObject({
            type: BID_OBJECT_TYPES.response,
            properties: {
                projectId: project.id,
                requirementId: requirement.id,
                title: `应答：${stringProperty(requirement, 'title')}`,
                content: responseContent(requirement, evidenceTitles, risk),
                evidenceRefs: evidenceTitles.join('；') || '暂无，已创建补充材料任务',
                status: '待审核',
                approved: false,
            },
        });
        await ontology.createLink({ type: BID_LINK_TYPES.requirementResponse, from: requirement.id, to: response.id });
        first ??= response;
        await ontology.updateObject({ id: requirement.id, properties: { status: '已应答' } });
    }
    if (first === undefined)
        throw new Error(`bid-studio: project '${project.id}' has no generated responses`);
    await ontology.updateObject({ id: project.id, properties: { stage: '应答生成' } });
    return first;
};
const submitReview = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const run = requireRun(input, ontology);
    const existing = objectsForProject(ontology, BID_OBJECT_TYPES.review, project.id)[0];
    if (existing !== undefined)
        return existing;
    const responses = objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id);
    if (responses.length === 0)
        throw new Error(`bid-studio: project '${project.id}' has no responses to review`);
    const review = await ontology.createObject({
        type: BID_OBJECT_TYPES.review,
        properties: { projectId: project.id, runId: run.id, status: '待审核' },
    });
    await ontology.createLink({ type: BID_LINK_TYPES.runReview, from: run.id, to: review.id });
    await ontology.updateObject({ id: project.id, properties: { stage: '待人工审核' } });
    return review;
};
const approveReview = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const reviewer = requiredString(input, 'reviewer');
    const review = objectsForProject(ontology, BID_OBJECT_TYPES.review, project.id)[0];
    if (review === undefined)
        throw new Error(`bid-studio: project '${project.id}' has no pending review`);
    const approved = await ontology.updateObject({
        id: review.id,
        properties: { status: '已批准', reviewer, comment: optionalString(input, 'comment') ?? '内容、证据引用和风险说明已确认。' },
    });
    for (const response of objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id)) {
        await ontology.updateObject({ id: response.id, properties: { status: '已批准', approved: true } });
    }
    const run = ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find(candidate => candidate.id === stringProperty(review, 'runId'));
    if (run !== undefined) {
        await updateStep(ontology, run.id, 'review', '已完成', `由 ${reviewer} 审核通过`);
        await ontology.updateObject({ id: run.id, properties: { currentStep: 'export' } });
    }
    await ontology.updateObject({ id: project.id, properties: { stage: '审核通过' } });
    return approved;
};
const exportDocument = async (input, ontology) => {
    const project = requireProject(input, ontology);
    const review = objectsForProject(ontology, BID_OBJECT_TYPES.review, project.id)[0];
    if (review === undefined || stringProperty(review, 'status') !== '已批准') {
        throw new Error(`bid-studio: project '${project.id}' must pass human review before export`);
    }
    const existing = objectsForProject(ontology, BID_OBJECT_TYPES.artifact, project.id)
        .find(candidate => stringProperty(candidate, 'status') === '正式版');
    const runId = stringProperty(review, 'runId');
    const artifact = existing ?? await ontology.createObject({
        type: BID_OBJECT_TYPES.artifact,
        properties: {
            projectId: project.id,
            runId,
            name: `${stringProperty(project, 'name')}-正式标书.md`,
            format: 'markdown',
            content: exportMarkdown(project, ontology),
            status: '正式版',
        },
    });
    if (existing === undefined)
        await ontology.createLink({ type: BID_LINK_TYPES.projectArtifact, from: project.id, to: artifact.id });
    const run = ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find(candidate => candidate.id === runId);
    if (run !== undefined) {
        await updateStep(ontology, run.id, 'export', '已完成', '正式 Markdown 制品已汇编');
        await ontology.updateObject({ id: run.id, properties: { status: '已完成', currentStep: 'completed', completedAt: new Date().toISOString() } });
    }
    await ontology.updateObject({ id: project.id, properties: { stage: '已导出' } });
    return artifact;
};
async function runToReview(input, ontology, handlers, startWorkflow) {
    const project = requireProject(input, ontology);
    const tenderText = requiredString(input, 'tenderText');
    const existing = objectsForProject(ontology, BID_OBJECT_TYPES.workflowRun, project.id)[0];
    if (existing !== undefined)
        return existing;
    const run = await ontology.createObject({
        type: BID_OBJECT_TYPES.workflowRun,
        properties: { projectId: project.id, workflowId: BID_WORKFLOW.id, status: '运行中', currentStep: 'import', startedAt: new Date().toISOString() },
    });
    await ontology.createLink({ type: BID_LINK_TYPES.projectRun, from: project.id, to: run.id });
    for (const [index, step] of BID_WORKFLOW.steps.entries()) {
        const stepObject = await ontology.createObject({
            type: BID_OBJECT_TYPES.workflowStep,
            properties: { projectId: project.id, runId: run.id, stepId: step.id, label: step.label, driver: step.driver, status: '待执行', sequence: index + 1 },
        });
        await ontology.createLink({ type: BID_LINK_TYPES.runStep, from: run.id, to: stepObject.id });
    }
    const automated = BID_WORKFLOW.steps.slice(0, 6);
    try {
        const workflow = startWorkflow({
            script: BID_WORKFLOW_SCRIPT,
            meta: { name: BID_WORKFLOW.id, description: BID_WORKFLOW.label },
            args: { steps: automated.map(step => step.id) },
            activities: {
                'bid.execute-step': async (activityInput, signal) => {
                    signal.throwIfAborted();
                    const stepId = activityString(activityInput, 'stepId');
                    const step = automated.find(candidate => candidate.id === stepId);
                    if (step === undefined)
                        throw new Error(`bid-studio: unknown automated workflow step '${stepId}'`);
                    await updateStep(ontology, run.id, step.id, '执行中', step.description);
                    await ontology.updateObject({ id: run.id, properties: { currentStep: step.id } });
                    const handler = handlers[step.action];
                    if (handler === undefined)
                        throw new Error(`bid-studio: workflow step '${step.id}' has no adapter`);
                    await handler(step.id === 'import'
                        ? { projectId: project.id, title: `${stringProperty(project, 'name')}招标文件`, content: tenderText }
                        : { projectId: project.id }, ontology);
                    await updateStep(ontology, run.id, step.id, '已完成', await stepResultDetail(step, project.id, ontology));
                    return { stepId: step.id };
                },
                'bid.submit-review': async (_activityInput, signal) => {
                    signal.throwIfAborted();
                    const review = await submitReview({ projectId: project.id, runId: run.id }, ontology);
                    return { reviewId: review.id };
                },
                'bid.finish-review': async (_activityInput, signal) => {
                    signal.throwIfAborted();
                    await updateStep(ontology, run.id, 'review', '待人工', '等待审核人确认应答、证据引用和风险');
                    return await ontology.updateObject({ id: run.id, properties: { status: '待人工审核', currentStep: 'review' } });
                },
            },
        });
        const result = await workflow.result;
        await workflow.dispose();
        if (result.stopReason !== 'completed')
            throw new Error(result.error ?? `bid-studio: workflow stopped with ${result.stopReason}`);
        return requireRun({ runId: run.id }, ontology);
    }
    catch (error) {
        const current = stringProperty(ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find(candidate => candidate.id === run.id) ?? run, 'currentStep');
        await updateStep(ontology, run.id, current, '失败', error instanceof Error ? error.message : String(error));
        await ontology.updateObject({ id: run.id, properties: { status: '失败' } });
        throw error;
    }
}
function activityString(input, key) {
    if (typeof input !== 'object' || input === null || !(key in input))
        throw new Error(`bid-studio: workflow activity requires '${key}'`);
    const value = input[key];
    if (typeof value !== 'string' || value.length === 0)
        throw new Error(`bid-studio: workflow activity '${key}' must be a non-empty string`);
    return value;
}
function requireProject(input, ontology) {
    const projectId = requiredString(input, 'projectId');
    const project = ontology.listObjects(BID_OBJECT_TYPES.project).find(candidate => candidate.id === projectId);
    if (project === undefined)
        throw new Error(`bid-studio: project not found: ${projectId}`);
    return project;
}
function requireRun(input, ontology) {
    const runId = requiredString(input, 'runId');
    const run = ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find(candidate => candidate.id === runId);
    if (run === undefined)
        throw new Error(`bid-studio: workflow run not found: ${runId}`);
    return run;
}
function requiredString(input, key) {
    const value = input[key];
    if (typeof value !== 'string' || value.trim().length === 0)
        throw new Error(`bid-studio: ${key} must be a non-empty string`);
    return value.trim();
}
function optionalString(input, key) {
    const value = input[key];
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}
function stringProperty(object, key) {
    const value = object.properties[key];
    return typeof value === 'string' ? value : '';
}
function booleanProperty(object, key) {
    return object.properties[key] === true;
}
function objectsForProject(ontology, type, projectId) {
    return ontology.listObjects(type).filter(candidate => candidate.properties.projectId === projectId);
}
function tenderLines(content) {
    return content.split(/\r?\n/u)
        .map((text, index) => ({ number: index + 1, text: text.trim().replace(/^\s*(?:\d+[.、)]|[-*])\s*/u, '') }))
        .filter(line => line.text.length >= 6)
        .slice(0, 12);
}
function scoreFrom(text) {
    const match = /(\d+(?:\.\d+)?)\s*分/u.exec(text);
    return match?.[1] === undefined ? undefined : Number(match[1]);
}
function classifyRequirement(text) {
    if (/资质|资格|认证|投标人/u.test(text))
        return '资格';
    if (/交付|工期|实施|验收|培训/u.test(text))
        return '交付';
    if (/报价|价格|付款|合同|商务/u.test(text))
        return '商务';
    return '技术';
}
function selectEvidence(requirement, evidence) {
    const category = stringProperty(requirement, 'category');
    const title = stringProperty(requirement, 'title');
    const keyword = evidence.find(candidate => stringProperty(candidate, 'keywords').split('|').some(value => value.length > 1 && title.includes(value)));
    if (keyword !== undefined)
        return { evidence: keyword, confidence: 0.94, rationale: '要求文本命中证据关键词。' };
    const exact = evidence.find(candidate => stringProperty(candidate, 'category') === category);
    return exact === undefined ? undefined : { evidence: exact, confidence: 0.86, rationale: `证据分类与${category}要求一致。` };
}
function responseContent(requirement, evidenceTitles, risk) {
    const title = stringProperty(requirement, 'title');
    if (evidenceTitles.length === 0)
        return `我方已识别要求“${title}”，当前证据库尚无直接证明材料。该项按风险处理，并已创建补充材料任务，最终承诺以审核结论为准。`;
    return `我方完全响应要求“${title}”。现有${evidenceTitles.join('、')}可证明相关能力，实施过程中将按招标文件要求提交原件或可核验副本。${risk === undefined ? '' : ` 已同步关注风险：${stringProperty(risk, 'title')}。`}`;
}
function exportMarkdown(project, ontology) {
    const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
    const responses = objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id);
    const risks = objectsForProject(ontology, BID_OBJECT_TYPES.risk, project.id);
    const approved = responses.filter(response => booleanProperty(response, 'approved')).length;
    const lines = [
        `# ${stringProperty(project, 'name')} — 投标文件`, '',
        '> 本制品由标准投标应答流程汇编，要求、证据、风险和章节保留本体对象引用。', '',
        '## 一、投标响应概览', '',
        `- 招标要求：${requirements.length} 项`,
        `- 已批准章节：${approved} 项`,
        `- 待闭环风险：${risks.filter(risk => !booleanProperty(risk, 'resolved')).length} 项`, '',
        '## 二、符合性矩阵', '',
        '| 序号 | 招标要求 | 分类 | 分值 | 响应状态 |',
        '| --- | --- | --- | ---: | --- |',
        ...requirements.map((requirement, index) => {
            const score = requirement.properties.score;
            return `| ${index + 1} | ${stringProperty(requirement, 'title').replaceAll('|', '\\|')} | ${stringProperty(requirement, 'category')} | ${typeof score === 'number' ? score : '-'} | ${stringProperty(requirement, 'status')} |`;
        }), '',
        '## 三、详细应答', '',
        ...responses.flatMap((response, index) => [`### 3.${index + 1} ${stringProperty(response, 'title')}`, '', stringProperty(response, 'content'), '', `证据引用：${stringProperty(response, 'evidenceRefs')}`, '']),
        '## 四、风险与待办', '',
        ...(risks.length === 0 ? ['未识别到材料缺口。'] : risks.map(risk => `- **${stringProperty(risk, 'severity')}**：${stringProperty(risk, 'title')}（${booleanProperty(risk, 'resolved') ? '已解决' : '待处理'}）`)), '',
        '## 五、审核结论', '',
        '应答章节、证据引用和风险说明已经人工审核，可进入正式排版与签章环节。', '',
    ];
    return lines.join('\n');
}
async function updateStep(ontology, runId, stepId, status, detail) {
    const step = ontology.listObjects(BID_OBJECT_TYPES.workflowStep)
        .find(candidate => candidate.properties.runId === runId && candidate.properties.stepId === stepId);
    if (step !== undefined)
        await ontology.updateObject({ id: step.id, properties: { status, detail } });
}
async function stepResultDetail(step, projectId, ontology) {
    const count = step.produces.reduce((total, type) => {
        const objects = type === BID_OBJECT_TYPES.evidence
            ? ontology.listObjects(type)
            : objectsForProject(ontology, type, projectId);
        return total + objects.length;
    }, 0);
    if (step.id === 'match') {
        const coverage = await ontology.executeFunction(BID_FUNCTIONS.evidenceCoverage, { projectId });
        if (typeof coverage !== 'number')
            throw new Error('bid-studio: evidence coverage Function returned a non-number');
        return `${step.label}完成，当前关联对象 ${count} 条，证据覆盖率 ${Math.round(coverage * 100)}%。`;
    }
    return `${step.label}完成，当前关联对象 ${count} 条。`;
}
//# sourceMappingURL=workflow.js.map