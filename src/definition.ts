/** Bid ontology and executable process definition shared by Host and browser. */
import type {
  OntologyActionDriver,
  OntologyActionId,
  OntologyDefinition,
  OntologyDefinitionId,
  OntologyFunctionId,
  OntologyLinkTypeId,
  OntologyObjectTypeId,
} from 'aiko-dsh-bid-studio/ontology/runtime'

const action = (value: string): OntologyActionId => value as OntologyActionId
const definition = (value: string): OntologyDefinitionId => value as OntologyDefinitionId
const ontologyFunction = (value: string): OntologyFunctionId => value as OntologyFunctionId
const link = (value: string): OntologyLinkTypeId => value as OntologyLinkTypeId
const objectType = (value: string): OntologyObjectTypeId => value as OntologyObjectTypeId

/** Object-type ids owned by the bid plugin. */
export const BID_OBJECT_TYPES = {
  project: objectType('bid.project'),
  tenderDocument: objectType('bid.tender-document'),
  requirement: objectType('bid.requirement'),
  scoreCriterion: objectType('bid.score-criterion'),
  evidence: objectType('bid.evidence'),
  evidenceMatch: objectType('bid.evidence-match'),
  risk: objectType('bid.risk'),
  response: objectType('bid.response'),
  task: objectType('bid.task'),
  review: objectType('bid.review'),
  artifact: objectType('bid.artifact'),
  workflowRun: objectType('bid.workflow-run'),
  workflowStep: objectType('bid.workflow-step'),
} as const

/** Action ids forming the executable bid route. */
export const BID_ACTIONS = {
  createProject: action('bid.create-project'),
  importTender: action('bid.import-tender'),
  analyzeTender: action('bid.analyze-tender'),
  seedEvidence: action('bid.seed-evidence'),
  matchEvidence: action('bid.match-evidence'),
  assessRisks: action('bid.assess-risks'),
  generateResponses: action('bid.generate-responses'),
  submitReview: action('bid.submit-review'),
  approveReview: action('bid.approve-review'),
  exportDocument: action('bid.export-document'),
  runToReview: action('bid.run-to-review'),
} as const

/** Read-only business computations exposed by the bid ontology. */
export const BID_FUNCTIONS = {
  requirementsForProject: ontologyFunction('bid.requirements-for-project'),
  evidenceCoverage: ontologyFunction('bid.evidence-coverage'),
  unresolvedRiskCount: ontologyFunction('bid.unresolved-risk-count'),
} as const

/** Link-type ids materialized by bid Actions. */
export const BID_LINK_TYPES = {
  projectDocument: link('bid.project-document'),
  documentRequirement: link('bid.document-requirement'),
  requirementScore: link('bid.requirement-score'),
  requirementMatch: link('bid.requirement-match'),
  evidenceMatch: link('bid.evidence-match'),
  requirementRisk: link('bid.requirement-risk'),
  riskTask: link('bid.risk-task'),
  requirementResponse: link('bid.requirement-response'),
  projectRun: link('bid.project-run'),
  runStep: link('bid.run-step'),
  runReview: link('bid.run-review'),
  projectArtifact: link('bid.project-artifact'),
} as const

/** Stable shortcut for project creation Consumers. */
export const CREATE_BID_PROJECT = BID_ACTIONS.createProject
/** Stable shortcut for running automated steps to the review gate. */
export const RUN_BID_TO_REVIEW = BID_ACTIONS.runToReview
/** Stable shortcut for the human approval Action. */
export const APPROVE_BID_REVIEW = BID_ACTIONS.approveReview
/** Stable shortcut for the post-approval export Action. */
export const EXPORT_BID_DOCUMENT = BID_ACTIONS.exportDocument

/** Stable ids of the persisted business-process steps. */
export type BidWorkflowStepId =
  | 'import'
  | 'analyze'
  | 'evidence'
  | 'match'
  | 'risk'
  | 'response'
  | 'review'
  | 'export'

/** One step in the installable bid process. */
export interface BidWorkflowStepDefinition {
  readonly id: BidWorkflowStepId
  readonly label: string
  readonly description: string
  readonly driver: OntologyActionDriver
  readonly action: OntologyActionId
  readonly produces: readonly OntologyObjectTypeId[]
}

/** Versioned process definition rendered and executed by the bid plugin. */
export interface BidWorkflowDefinition {
  readonly id: string
  readonly version: number
  readonly label: string
  readonly steps: readonly BidWorkflowStepDefinition[]
}

/** Complete route from source intake to an approved export. */
export const BID_WORKFLOW: BidWorkflowDefinition = {
  id: 'bid.standard-response',
  version: 2,
  label: '标准投标应答流程',
  steps: [
    { id: 'import', label: '导入招标文件', description: '保存招标原文与来源。', driver: 'machine', action: BID_ACTIONS.importTender, produces: [BID_OBJECT_TYPES.tenderDocument] },
    { id: 'analyze', label: '解析要求与评分', description: '提取可追溯要求和评分项。', driver: 'agent', action: BID_ACTIONS.analyzeTender, produces: [BID_OBJECT_TYPES.requirement, BID_OBJECT_TYPES.scoreCriterion] },
    { id: 'evidence', label: '准备企业证据', description: '加载可复用资质、案例、团队与方案证据。', driver: 'machine', action: BID_ACTIONS.seedEvidence, produces: [BID_OBJECT_TYPES.evidence] },
    { id: 'match', label: '匹配企业证据', description: '建立要求与企业证据的匹配记录。', driver: 'workflow', action: BID_ACTIONS.matchEvidence, produces: [BID_OBJECT_TYPES.evidenceMatch] },
    { id: 'risk', label: '识别风险与任务', description: '为证据缺口创建风险和闭环任务。', driver: 'workflow', action: BID_ACTIONS.assessRisks, produces: [BID_OBJECT_TYPES.risk, BID_OBJECT_TYPES.task] },
    { id: 'response', label: '生成应答章节', description: '基于要求和证据生成带引用的章节。', driver: 'agent', action: BID_ACTIONS.generateResponses, produces: [BID_OBJECT_TYPES.response] },
    { id: 'review', label: '人工审核', description: '人工确认章节、风险和导出资格。', driver: 'human', action: BID_ACTIONS.approveReview, produces: [BID_OBJECT_TYPES.review] },
    { id: 'export', label: '汇编并导出', description: '汇总已审核章节和风险说明。', driver: 'workflow', action: BID_ACTIONS.exportDocument, produces: [BID_OBJECT_TYPES.artifact] },
  ],
}

const projectId = { key: 'projectId', label: '所属项目', type: 'string' as const, required: true }
const runId = { key: 'runId', label: '流程运行', type: 'string' as const, required: true }

/** Installable bid ontology: work objects, traceability links, Actions, and review state. */
export const BID_ONTOLOGY: OntologyDefinition = {
  id: definition('bid-studio'),
  version: 2,
  objectTypes: [
    {
      id: BID_OBJECT_TYPES.project,
      label: '投标项目',
      description: '一次投标工作的聚合根，记录阶段、截止时间与责任主体。',
      properties: [
        { key: 'name', label: '项目名称', type: 'string', required: true },
        { key: 'deadline', label: '截标时间', type: 'date' },
        { key: 'owner', label: '项目负责人', type: 'string' },
        { key: 'stage', label: '阶段', type: 'string', required: true, values: ['资料准备', '解析中', '证据匹配', '应答生成', '待人工审核', '审核通过', '已导出'] },
      ],
    },
    {
      id: BID_OBJECT_TYPES.tenderDocument,
      label: '招标文件',
      description: '进入流程的招标原文及其来源和解析状态。',
      properties: [
        projectId,
        { key: 'title', label: '文件名称', type: 'string', required: true },
        { key: 'sourceName', label: '来源', type: 'string', required: true },
        { key: 'content', label: '原文', type: 'string', required: true },
        { key: 'status', label: '状态', type: 'string', required: true, values: ['已导入', '已解析'] },
      ],
    },
    {
      id: BID_OBJECT_TYPES.requirement,
      label: '招标要求',
      description: '从招标文件提取的资格、商务、技术或交付约束。',
      properties: [
        projectId,
        { key: 'documentId', label: '来源文件', type: 'string', required: true },
        { key: 'title', label: '要求', type: 'string', required: true },
        { key: 'category', label: '分类', type: 'string', required: true, values: ['资格', '商务', '技术', '交付'] },
        { key: 'source', label: '来源位置', type: 'string', required: true },
        { key: 'mandatory', label: '是否硬性', type: 'boolean', required: true },
        { key: 'score', label: '分值', type: 'number' },
        { key: 'status', label: '处理状态', type: 'string', required: true, values: ['待匹配', '已匹配', '存在缺口', '已应答'] },
      ],
    },
    {
      id: BID_OBJECT_TYPES.scoreCriterion,
      label: '评分项',
      description: '与要求关联的量化评审标准。',
      properties: [projectId, { key: 'requirementId', label: '关联要求', type: 'string', required: true }, { key: 'title', label: '评分说明', type: 'string', required: true }, { key: 'score', label: '分值', type: 'number', required: true }, { key: 'source', label: '来源位置', type: 'string', required: true }],
    },
    {
      id: BID_OBJECT_TYPES.evidence,
      label: '企业证据',
      description: '可跨项目复用的资质、案例、人员、方案和服务证明。',
      properties: [
        { key: 'title', label: '证据名称', type: 'string', required: true },
        { key: 'category', label: '分类', type: 'string', required: true, values: ['资格', '技术', '交付', '服务'] },
        { key: 'summary', label: '证据摘要', type: 'string', required: true },
        { key: 'source', label: '来源', type: 'string', required: true },
        { key: 'keywords', label: '关键词', type: 'string', required: true },
        { key: 'validUntil', label: '有效期', type: 'date' },
      ],
    },
    {
      id: BID_OBJECT_TYPES.evidenceMatch,
      label: '证据匹配',
      description: '要求与证据之间带置信度和理由的可追溯匹配。',
      properties: [projectId, { key: 'requirementId', label: '招标要求', type: 'string', required: true }, { key: 'evidenceId', label: '企业证据', type: 'string', required: true }, { key: 'confidence', label: '置信度', type: 'number', required: true }, { key: 'rationale', label: '匹配理由', type: 'string', required: true }, { key: 'status', label: '确认状态', type: 'string', required: true, values: ['建议', '已确认', '已拒绝'] }],
    },
    {
      id: BID_OBJECT_TYPES.risk,
      label: '风险与缺口',
      description: '未满足、证据不足、冲突或临期事项。',
      properties: [
        projectId,
        { key: 'requirementId', label: '关联要求', type: 'string', required: true },
        { key: 'title', label: '风险', type: 'string', required: true },
        { key: 'reason', label: '原因', type: 'string', required: true },
        { key: 'severity', label: '级别', type: 'string', required: true, values: ['高', '中', '低'] },
        { key: 'resolved', label: '已解决', type: 'boolean', required: true },
      ],
    },
    {
      id: BID_OBJECT_TYPES.response,
      label: '应答章节',
      description: '面向一个招标要求、包含证据引用和审核状态的回答。',
      properties: [
        projectId,
        { key: 'requirementId', label: '关联要求', type: 'string', required: true },
        { key: 'title', label: '章节', type: 'string', required: true },
        { key: 'content', label: '正文', type: 'string', required: true },
        { key: 'evidenceRefs', label: '证据引用', type: 'string', required: true },
        { key: 'status', label: '状态', type: 'string', required: true, values: ['草稿', '待审核', '已批准'] },
        { key: 'approved', label: '已审核', type: 'boolean', required: true },
      ],
    },
    {
      id: BID_OBJECT_TYPES.task,
      label: '协作任务',
      description: '围绕风险和材料缺口产生的责任人工作项。',
      properties: [projectId, { key: 'riskId', label: '关联风险', type: 'string', required: true }, { key: 'title', label: '任务', type: 'string', required: true }, { key: 'owner', label: '负责人', type: 'string' }, { key: 'status', label: '状态', type: 'string', required: true, values: ['待处理', '处理中', '已完成'] }],
    },
    {
      id: BID_OBJECT_TYPES.review,
      label: '标书审核',
      description: '人工审核结论，是正式导出的必要条件。',
      properties: [projectId, runId, { key: 'status', label: '审核状态', type: 'string', required: true, values: ['待审核', '已批准', '已驳回'] }, { key: 'reviewer', label: '审核人', type: 'string' }, { key: 'comment', label: '审核意见', type: 'string' }],
    },
    {
      id: BID_OBJECT_TYPES.artifact,
      label: '标书制品',
      description: '由已审核项目汇编出的可预览和下载交付内容。',
      properties: [projectId, { key: 'runId', label: '流程运行', type: 'string' }, { key: 'name', label: '制品名称', type: 'string', required: true }, { key: 'format', label: '格式', type: 'string', required: true }, { key: 'content', label: '内容', type: 'string', required: true }, { key: 'status', label: '状态', type: 'string', required: true, values: ['可评审', '正式版'] }],
    },
    {
      id: BID_OBJECT_TYPES.workflowRun,
      label: '流程运行',
      description: '一次可恢复的标准投标流程执行记录。',
      properties: [projectId, { key: 'workflowId', label: '流程定义', type: 'string', required: true }, { key: 'status', label: '运行状态', type: 'string', required: true, values: ['运行中', '待人工审核', '已完成', '失败'] }, { key: 'currentStep', label: '当前步骤', type: 'string', required: true }, { key: 'startedAt', label: '开始时间', type: 'date', required: true }, { key: 'completedAt', label: '完成时间', type: 'date' }],
    },
    {
      id: BID_OBJECT_TYPES.workflowStep,
      label: '流程步骤',
      description: '一个流程运行中可观察、可审计的步骤状态。',
      properties: [projectId, runId, { key: 'stepId', label: '步骤标识', type: 'string', required: true }, { key: 'label', label: '步骤', type: 'string', required: true }, { key: 'driver', label: '驱动者', type: 'string', required: true, values: ['machine', 'workflow', 'agent', 'human'] }, { key: 'status', label: '状态', type: 'string', required: true, values: ['待执行', '执行中', '待人工', '已完成', '失败'] }, { key: 'sequence', label: '顺序', type: 'number', required: true }, { key: 'detail', label: '执行摘要', type: 'string' }],
    },
  ],
  linkTypes: [
    { id: BID_LINK_TYPES.projectDocument, label: '包含文件', from: BID_OBJECT_TYPES.project, to: BID_OBJECT_TYPES.tenderDocument, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.documentRequirement, label: '提取要求', from: BID_OBJECT_TYPES.tenderDocument, to: BID_OBJECT_TYPES.requirement, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.requirementScore, label: '定义评分', from: BID_OBJECT_TYPES.requirement, to: BID_OBJECT_TYPES.scoreCriterion, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.requirementMatch, label: '获得证据匹配', from: BID_OBJECT_TYPES.requirement, to: BID_OBJECT_TYPES.evidenceMatch, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.evidenceMatch, label: '参与匹配', from: BID_OBJECT_TYPES.evidence, to: BID_OBJECT_TYPES.evidenceMatch, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.requirementRisk, label: '产生风险', from: BID_OBJECT_TYPES.requirement, to: BID_OBJECT_TYPES.risk, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.riskTask, label: '通过任务闭环', from: BID_OBJECT_TYPES.risk, to: BID_OBJECT_TYPES.task, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.requirementResponse, label: '由章节应答', from: BID_OBJECT_TYPES.requirement, to: BID_OBJECT_TYPES.response, cardinality: 'one-to-one' },
    { id: BID_LINK_TYPES.projectRun, label: '启动流程', from: BID_OBJECT_TYPES.project, to: BID_OBJECT_TYPES.workflowRun, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.runStep, label: '包含步骤', from: BID_OBJECT_TYPES.workflowRun, to: BID_OBJECT_TYPES.workflowStep, cardinality: 'one-to-many' },
    { id: BID_LINK_TYPES.runReview, label: '等待审核', from: BID_OBJECT_TYPES.workflowRun, to: BID_OBJECT_TYPES.review, cardinality: 'one-to-one' },
    { id: BID_LINK_TYPES.projectArtifact, label: '生成制品', from: BID_OBJECT_TYPES.project, to: BID_OBJECT_TYPES.artifact, cardinality: 'one-to-many' },
  ],
  functions: [
    { id: BID_FUNCTIONS.requirementsForProject, label: '查询项目要求', description: '返回一个投标项目的全部招标要求。', inputs: [projectId], result: { kind: 'object-list', objectType: BID_OBJECT_TYPES.requirement } },
    { id: BID_FUNCTIONS.evidenceCoverage, label: '计算证据覆盖率', description: '计算已有证据匹配的要求占比。', inputs: [projectId], result: { kind: 'scalar', type: 'number' } },
    { id: BID_FUNCTIONS.unresolvedRiskCount, label: '统计未闭环风险', description: '统计项目中尚未解决的风险数量。', inputs: [projectId], result: { kind: 'scalar', type: 'number' } },
  ],
  actions: [
    { id: BID_ACTIONS.createProject, label: '新建投标项目', target: BID_OBJECT_TYPES.project, driver: 'machine', description: '创建持久化项目聚合根。', inputs: [{ key: 'name', label: '项目名称', type: 'string', required: true }], result: BID_OBJECT_TYPES.project },
    { id: BID_ACTIONS.importTender, label: '导入招标文件', target: BID_OBJECT_TYPES.project, driver: 'machine', description: '保存原文并推进项目阶段。', inputs: [projectId, { key: 'title', label: '文件名称', type: 'string', required: true }, { key: 'content', label: '招标原文', type: 'string', required: true }], result: BID_OBJECT_TYPES.tenderDocument },
    { id: BID_ACTIONS.analyzeTender, label: '解析招标文件', target: BID_OBJECT_TYPES.tenderDocument, driver: 'agent', description: '提取要求、评分项和来源定位；本地验证适配器提供可重复结果。', inputs: [projectId], result: BID_OBJECT_TYPES.requirement },
    { id: BID_ACTIONS.seedEvidence, label: '准备企业证据', target: BID_OBJECT_TYPES.project, driver: 'machine', description: '加载本地验证证据目录。', inputs: [projectId], result: BID_OBJECT_TYPES.evidence },
    { id: BID_ACTIONS.matchEvidence, label: '匹配企业证据', target: BID_OBJECT_TYPES.requirement, driver: 'workflow', description: '对要求批量生成证据匹配。', inputs: [projectId], result: BID_OBJECT_TYPES.evidenceMatch },
    { id: BID_ACTIONS.assessRisks, label: '识别风险与任务', target: BID_OBJECT_TYPES.project, driver: 'workflow', description: '为无有效匹配的要求创建风险与任务。', inputs: [projectId], result: BID_OBJECT_TYPES.risk },
    { id: BID_ACTIONS.generateResponses, label: '生成应答章节', target: BID_OBJECT_TYPES.response, driver: 'agent', description: '依据要求、证据和缺口生成可追溯章节；本地验证适配器提供可重复结果。', inputs: [projectId], result: BID_OBJECT_TYPES.response },
    { id: BID_ACTIONS.submitReview, label: '提交人工审核', target: BID_OBJECT_TYPES.project, driver: 'workflow', description: '创建审核对象并暂停流程。', inputs: [projectId, runId], result: BID_OBJECT_TYPES.review },
    { id: BID_ACTIONS.approveReview, label: '批准标书', target: BID_OBJECT_TYPES.review, driver: 'human', description: '记录审核人和意见，并批准应答章节。', inputs: [projectId, { key: 'reviewer', label: '审核人', type: 'string', required: true }, { key: 'comment', label: '审核意见', type: 'string' }], result: BID_OBJECT_TYPES.review },
    { id: BID_ACTIONS.exportDocument, label: '导出正式标书', target: BID_OBJECT_TYPES.project, driver: 'workflow', description: '仅在审核批准后汇编正式 Markdown 制品。', inputs: [projectId], result: BID_OBJECT_TYPES.artifact },
    { id: BID_ACTIONS.runToReview, label: '运行完整生成流程', target: BID_OBJECT_TYPES.project, driver: 'workflow', description: '从导入招标原文运行至人工审核闸口。', inputs: [projectId, { key: 'tenderText', label: '招标原文', type: 'string', required: true }], result: BID_OBJECT_TYPES.workflowRun },
  ],
}
