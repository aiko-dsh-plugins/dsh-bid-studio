import { defineTool } from "@deepseek-ai/dsh-tools";
//#region lib/types/definition.js
const action = (value) => value;
const definition = (value) => value;
const ontologyFunction = (value) => value;
const link = (value) => value;
const objectType = (value) => value;
/** Object-type ids owned by the bid plugin. */
const BID_OBJECT_TYPES = {
	project: objectType("bid.project"),
	tenderDocument: objectType("bid.tender-document"),
	requirement: objectType("bid.requirement"),
	scoreCriterion: objectType("bid.score-criterion"),
	evidence: objectType("bid.evidence"),
	evidenceMatch: objectType("bid.evidence-match"),
	risk: objectType("bid.risk"),
	response: objectType("bid.response"),
	task: objectType("bid.task"),
	review: objectType("bid.review"),
	artifact: objectType("bid.artifact"),
	workflowRun: objectType("bid.workflow-run"),
	workflowStep: objectType("bid.workflow-step")
};
/** Action ids forming the executable bid route. */
const BID_ACTIONS = {
	createProject: action("bid.create-project"),
	importTender: action("bid.import-tender"),
	analyzeTender: action("bid.analyze-tender"),
	seedEvidence: action("bid.seed-evidence"),
	matchEvidence: action("bid.match-evidence"),
	assessRisks: action("bid.assess-risks"),
	generateResponses: action("bid.generate-responses"),
	submitReview: action("bid.submit-review"),
	approveReview: action("bid.approve-review"),
	exportDocument: action("bid.export-document"),
	runToReview: action("bid.run-to-review")
};
/** Read-only business computations exposed by the bid ontology. */
const BID_FUNCTIONS = {
	requirementsForProject: ontologyFunction("bid.requirements-for-project"),
	evidenceCoverage: ontologyFunction("bid.evidence-coverage"),
	unresolvedRiskCount: ontologyFunction("bid.unresolved-risk-count")
};
/** Link-type ids materialized by bid Actions. */
const BID_LINK_TYPES = {
	projectDocument: link("bid.project-document"),
	documentRequirement: link("bid.document-requirement"),
	requirementScore: link("bid.requirement-score"),
	requirementMatch: link("bid.requirement-match"),
	evidenceMatch: link("bid.evidence-match"),
	requirementRisk: link("bid.requirement-risk"),
	riskTask: link("bid.risk-task"),
	requirementResponse: link("bid.requirement-response"),
	projectRun: link("bid.project-run"),
	runStep: link("bid.run-step"),
	runReview: link("bid.run-review"),
	projectArtifact: link("bid.project-artifact")
};
/** Stable shortcut for project creation Consumers. */
const CREATE_BID_PROJECT = BID_ACTIONS.createProject;
/** Stable shortcut for running automated steps to the review gate. */
const RUN_BID_TO_REVIEW = BID_ACTIONS.runToReview;
/** Stable shortcut for the human approval Action. */
const APPROVE_BID_REVIEW = BID_ACTIONS.approveReview;
/** Stable shortcut for the post-approval export Action. */
const EXPORT_BID_DOCUMENT = BID_ACTIONS.exportDocument;
/** Complete route from source intake to an approved export. */
const BID_WORKFLOW = {
	id: "bid.standard-response",
	version: 2,
	label: "标准投标应答流程",
	steps: [
		{
			id: "import",
			label: "导入招标文件",
			description: "保存招标原文与来源。",
			driver: "machine",
			action: BID_ACTIONS.importTender,
			produces: [BID_OBJECT_TYPES.tenderDocument]
		},
		{
			id: "analyze",
			label: "解析要求与评分",
			description: "提取可追溯要求和评分项。",
			driver: "agent",
			action: BID_ACTIONS.analyzeTender,
			produces: [BID_OBJECT_TYPES.requirement, BID_OBJECT_TYPES.scoreCriterion]
		},
		{
			id: "evidence",
			label: "准备企业证据",
			description: "加载可复用资质、案例、团队与方案证据。",
			driver: "machine",
			action: BID_ACTIONS.seedEvidence,
			produces: [BID_OBJECT_TYPES.evidence]
		},
		{
			id: "match",
			label: "匹配企业证据",
			description: "建立要求与企业证据的匹配记录。",
			driver: "workflow",
			action: BID_ACTIONS.matchEvidence,
			produces: [BID_OBJECT_TYPES.evidenceMatch]
		},
		{
			id: "risk",
			label: "识别风险与任务",
			description: "为证据缺口创建风险和闭环任务。",
			driver: "workflow",
			action: BID_ACTIONS.assessRisks,
			produces: [BID_OBJECT_TYPES.risk, BID_OBJECT_TYPES.task]
		},
		{
			id: "response",
			label: "生成应答章节",
			description: "基于要求和证据生成带引用的章节。",
			driver: "agent",
			action: BID_ACTIONS.generateResponses,
			produces: [BID_OBJECT_TYPES.response]
		},
		{
			id: "review",
			label: "人工审核",
			description: "人工确认章节、风险和导出资格。",
			driver: "human",
			action: BID_ACTIONS.approveReview,
			produces: [BID_OBJECT_TYPES.review]
		},
		{
			id: "export",
			label: "汇编并导出",
			description: "汇总已审核章节和风险说明。",
			driver: "workflow",
			action: BID_ACTIONS.exportDocument,
			produces: [BID_OBJECT_TYPES.artifact]
		}
	]
};
const projectId = {
	key: "projectId",
	label: "所属项目",
	type: "string",
	required: true
};
const runId = {
	key: "runId",
	label: "流程运行",
	type: "string",
	required: true
};
/** Installable bid ontology: work objects, traceability links, Actions, and review state. */
const BID_ONTOLOGY = {
	id: definition("bid-studio"),
	version: 2,
	objectTypes: [
		{
			id: BID_OBJECT_TYPES.project,
			label: "投标项目",
			description: "一次投标工作的聚合根，记录阶段、截止时间与责任主体。",
			properties: [
				{
					key: "name",
					label: "项目名称",
					type: "string",
					required: true
				},
				{
					key: "deadline",
					label: "截标时间",
					type: "date"
				},
				{
					key: "owner",
					label: "项目负责人",
					type: "string"
				},
				{
					key: "stage",
					label: "阶段",
					type: "string",
					required: true,
					values: [
						"资料准备",
						"解析中",
						"证据匹配",
						"应答生成",
						"待人工审核",
						"审核通过",
						"已导出"
					]
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.tenderDocument,
			label: "招标文件",
			description: "进入流程的招标原文及其来源和解析状态。",
			properties: [
				projectId,
				{
					key: "title",
					label: "文件名称",
					type: "string",
					required: true
				},
				{
					key: "sourceName",
					label: "来源",
					type: "string",
					required: true
				},
				{
					key: "content",
					label: "原文",
					type: "string",
					required: true
				},
				{
					key: "status",
					label: "状态",
					type: "string",
					required: true,
					values: ["已导入", "已解析"]
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.requirement,
			label: "招标要求",
			description: "从招标文件提取的资格、商务、技术或交付约束。",
			properties: [
				projectId,
				{
					key: "documentId",
					label: "来源文件",
					type: "string",
					required: true
				},
				{
					key: "title",
					label: "要求",
					type: "string",
					required: true
				},
				{
					key: "category",
					label: "分类",
					type: "string",
					required: true,
					values: [
						"资格",
						"商务",
						"技术",
						"交付"
					]
				},
				{
					key: "source",
					label: "来源位置",
					type: "string",
					required: true
				},
				{
					key: "mandatory",
					label: "是否硬性",
					type: "boolean",
					required: true
				},
				{
					key: "score",
					label: "分值",
					type: "number"
				},
				{
					key: "status",
					label: "处理状态",
					type: "string",
					required: true,
					values: [
						"待匹配",
						"已匹配",
						"存在缺口",
						"已应答"
					]
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.scoreCriterion,
			label: "评分项",
			description: "与要求关联的量化评审标准。",
			properties: [
				projectId,
				{
					key: "requirementId",
					label: "关联要求",
					type: "string",
					required: true
				},
				{
					key: "title",
					label: "评分说明",
					type: "string",
					required: true
				},
				{
					key: "score",
					label: "分值",
					type: "number",
					required: true
				},
				{
					key: "source",
					label: "来源位置",
					type: "string",
					required: true
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.evidence,
			label: "企业证据",
			description: "可跨项目复用的资质、案例、人员、方案和服务证明。",
			properties: [
				{
					key: "title",
					label: "证据名称",
					type: "string",
					required: true
				},
				{
					key: "category",
					label: "分类",
					type: "string",
					required: true,
					values: [
						"资格",
						"技术",
						"交付",
						"服务"
					]
				},
				{
					key: "summary",
					label: "证据摘要",
					type: "string",
					required: true
				},
				{
					key: "source",
					label: "来源",
					type: "string",
					required: true
				},
				{
					key: "keywords",
					label: "关键词",
					type: "string",
					required: true
				},
				{
					key: "validUntil",
					label: "有效期",
					type: "date"
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.evidenceMatch,
			label: "证据匹配",
			description: "要求与证据之间带置信度和理由的可追溯匹配。",
			properties: [
				projectId,
				{
					key: "requirementId",
					label: "招标要求",
					type: "string",
					required: true
				},
				{
					key: "evidenceId",
					label: "企业证据",
					type: "string",
					required: true
				},
				{
					key: "confidence",
					label: "置信度",
					type: "number",
					required: true
				},
				{
					key: "rationale",
					label: "匹配理由",
					type: "string",
					required: true
				},
				{
					key: "status",
					label: "确认状态",
					type: "string",
					required: true,
					values: [
						"建议",
						"已确认",
						"已拒绝"
					]
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.risk,
			label: "风险与缺口",
			description: "未满足、证据不足、冲突或临期事项。",
			properties: [
				projectId,
				{
					key: "requirementId",
					label: "关联要求",
					type: "string",
					required: true
				},
				{
					key: "title",
					label: "风险",
					type: "string",
					required: true
				},
				{
					key: "reason",
					label: "原因",
					type: "string",
					required: true
				},
				{
					key: "severity",
					label: "级别",
					type: "string",
					required: true,
					values: [
						"高",
						"中",
						"低"
					]
				},
				{
					key: "resolved",
					label: "已解决",
					type: "boolean",
					required: true
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.response,
			label: "应答章节",
			description: "面向一个招标要求、包含证据引用和审核状态的回答。",
			properties: [
				projectId,
				{
					key: "requirementId",
					label: "关联要求",
					type: "string",
					required: true
				},
				{
					key: "title",
					label: "章节",
					type: "string",
					required: true
				},
				{
					key: "content",
					label: "正文",
					type: "string",
					required: true
				},
				{
					key: "evidenceRefs",
					label: "证据引用",
					type: "string",
					required: true
				},
				{
					key: "status",
					label: "状态",
					type: "string",
					required: true,
					values: [
						"草稿",
						"待审核",
						"已批准"
					]
				},
				{
					key: "approved",
					label: "已审核",
					type: "boolean",
					required: true
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.task,
			label: "协作任务",
			description: "围绕风险和材料缺口产生的责任人工作项。",
			properties: [
				projectId,
				{
					key: "riskId",
					label: "关联风险",
					type: "string",
					required: true
				},
				{
					key: "title",
					label: "任务",
					type: "string",
					required: true
				},
				{
					key: "owner",
					label: "负责人",
					type: "string"
				},
				{
					key: "status",
					label: "状态",
					type: "string",
					required: true,
					values: [
						"待处理",
						"处理中",
						"已完成"
					]
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.review,
			label: "标书审核",
			description: "人工审核结论，是正式导出的必要条件。",
			properties: [
				projectId,
				runId,
				{
					key: "status",
					label: "审核状态",
					type: "string",
					required: true,
					values: [
						"待审核",
						"已批准",
						"已驳回"
					]
				},
				{
					key: "reviewer",
					label: "审核人",
					type: "string"
				},
				{
					key: "comment",
					label: "审核意见",
					type: "string"
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.artifact,
			label: "标书制品",
			description: "由已审核项目汇编出的可预览和下载交付内容。",
			properties: [
				projectId,
				{
					key: "runId",
					label: "流程运行",
					type: "string"
				},
				{
					key: "name",
					label: "制品名称",
					type: "string",
					required: true
				},
				{
					key: "format",
					label: "格式",
					type: "string",
					required: true
				},
				{
					key: "content",
					label: "内容",
					type: "string",
					required: true
				},
				{
					key: "status",
					label: "状态",
					type: "string",
					required: true,
					values: ["可评审", "正式版"]
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.workflowRun,
			label: "流程运行",
			description: "一次可恢复的标准投标流程执行记录。",
			properties: [
				projectId,
				{
					key: "workflowId",
					label: "流程定义",
					type: "string",
					required: true
				},
				{
					key: "status",
					label: "运行状态",
					type: "string",
					required: true,
					values: [
						"运行中",
						"待人工审核",
						"已完成",
						"失败"
					]
				},
				{
					key: "currentStep",
					label: "当前步骤",
					type: "string",
					required: true
				},
				{
					key: "startedAt",
					label: "开始时间",
					type: "date",
					required: true
				},
				{
					key: "completedAt",
					label: "完成时间",
					type: "date"
				}
			]
		},
		{
			id: BID_OBJECT_TYPES.workflowStep,
			label: "流程步骤",
			description: "一个流程运行中可观察、可审计的步骤状态。",
			properties: [
				projectId,
				runId,
				{
					key: "stepId",
					label: "步骤标识",
					type: "string",
					required: true
				},
				{
					key: "label",
					label: "步骤",
					type: "string",
					required: true
				},
				{
					key: "driver",
					label: "驱动者",
					type: "string",
					required: true,
					values: [
						"machine",
						"workflow",
						"agent",
						"human"
					]
				},
				{
					key: "status",
					label: "状态",
					type: "string",
					required: true,
					values: [
						"待执行",
						"执行中",
						"待人工",
						"已完成",
						"失败"
					]
				},
				{
					key: "sequence",
					label: "顺序",
					type: "number",
					required: true
				},
				{
					key: "detail",
					label: "执行摘要",
					type: "string"
				}
			]
		}
	],
	linkTypes: [
		{
			id: BID_LINK_TYPES.projectDocument,
			label: "包含文件",
			from: BID_OBJECT_TYPES.project,
			to: BID_OBJECT_TYPES.tenderDocument,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.documentRequirement,
			label: "提取要求",
			from: BID_OBJECT_TYPES.tenderDocument,
			to: BID_OBJECT_TYPES.requirement,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.requirementScore,
			label: "定义评分",
			from: BID_OBJECT_TYPES.requirement,
			to: BID_OBJECT_TYPES.scoreCriterion,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.requirementMatch,
			label: "获得证据匹配",
			from: BID_OBJECT_TYPES.requirement,
			to: BID_OBJECT_TYPES.evidenceMatch,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.evidenceMatch,
			label: "参与匹配",
			from: BID_OBJECT_TYPES.evidence,
			to: BID_OBJECT_TYPES.evidenceMatch,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.requirementRisk,
			label: "产生风险",
			from: BID_OBJECT_TYPES.requirement,
			to: BID_OBJECT_TYPES.risk,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.riskTask,
			label: "通过任务闭环",
			from: BID_OBJECT_TYPES.risk,
			to: BID_OBJECT_TYPES.task,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.requirementResponse,
			label: "由章节应答",
			from: BID_OBJECT_TYPES.requirement,
			to: BID_OBJECT_TYPES.response,
			cardinality: "one-to-one"
		},
		{
			id: BID_LINK_TYPES.projectRun,
			label: "启动流程",
			from: BID_OBJECT_TYPES.project,
			to: BID_OBJECT_TYPES.workflowRun,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.runStep,
			label: "包含步骤",
			from: BID_OBJECT_TYPES.workflowRun,
			to: BID_OBJECT_TYPES.workflowStep,
			cardinality: "one-to-many"
		},
		{
			id: BID_LINK_TYPES.runReview,
			label: "等待审核",
			from: BID_OBJECT_TYPES.workflowRun,
			to: BID_OBJECT_TYPES.review,
			cardinality: "one-to-one"
		},
		{
			id: BID_LINK_TYPES.projectArtifact,
			label: "生成制品",
			from: BID_OBJECT_TYPES.project,
			to: BID_OBJECT_TYPES.artifact,
			cardinality: "one-to-many"
		}
	],
	functions: [
		{
			id: BID_FUNCTIONS.requirementsForProject,
			label: "查询项目要求",
			description: "返回一个投标项目的全部招标要求。",
			inputs: [projectId],
			result: {
				kind: "object-list",
				objectType: BID_OBJECT_TYPES.requirement
			}
		},
		{
			id: BID_FUNCTIONS.evidenceCoverage,
			label: "计算证据覆盖率",
			description: "计算已有证据匹配的要求占比。",
			inputs: [projectId],
			result: {
				kind: "scalar",
				type: "number"
			}
		},
		{
			id: BID_FUNCTIONS.unresolvedRiskCount,
			label: "统计未闭环风险",
			description: "统计项目中尚未解决的风险数量。",
			inputs: [projectId],
			result: {
				kind: "scalar",
				type: "number"
			}
		}
	],
	actions: [
		{
			id: BID_ACTIONS.createProject,
			label: "新建投标项目",
			target: BID_OBJECT_TYPES.project,
			driver: "machine",
			description: "创建持久化项目聚合根。",
			inputs: [{
				key: "name",
				label: "项目名称",
				type: "string",
				required: true
			}],
			result: BID_OBJECT_TYPES.project
		},
		{
			id: BID_ACTIONS.importTender,
			label: "导入招标文件",
			target: BID_OBJECT_TYPES.project,
			driver: "machine",
			description: "保存原文并推进项目阶段。",
			inputs: [
				projectId,
				{
					key: "title",
					label: "文件名称",
					type: "string",
					required: true
				},
				{
					key: "content",
					label: "招标原文",
					type: "string",
					required: true
				}
			],
			result: BID_OBJECT_TYPES.tenderDocument
		},
		{
			id: BID_ACTIONS.analyzeTender,
			label: "解析招标文件",
			target: BID_OBJECT_TYPES.tenderDocument,
			driver: "agent",
			description: "提取要求、评分项和来源定位；本地验证适配器提供可重复结果。",
			inputs: [projectId],
			result: BID_OBJECT_TYPES.requirement
		},
		{
			id: BID_ACTIONS.seedEvidence,
			label: "准备企业证据",
			target: BID_OBJECT_TYPES.project,
			driver: "machine",
			description: "加载本地验证证据目录。",
			inputs: [projectId],
			result: BID_OBJECT_TYPES.evidence
		},
		{
			id: BID_ACTIONS.matchEvidence,
			label: "匹配企业证据",
			target: BID_OBJECT_TYPES.requirement,
			driver: "workflow",
			description: "对要求批量生成证据匹配。",
			inputs: [projectId],
			result: BID_OBJECT_TYPES.evidenceMatch
		},
		{
			id: BID_ACTIONS.assessRisks,
			label: "识别风险与任务",
			target: BID_OBJECT_TYPES.project,
			driver: "workflow",
			description: "为无有效匹配的要求创建风险与任务。",
			inputs: [projectId],
			result: BID_OBJECT_TYPES.risk
		},
		{
			id: BID_ACTIONS.generateResponses,
			label: "生成应答章节",
			target: BID_OBJECT_TYPES.response,
			driver: "agent",
			description: "依据要求、证据和缺口生成可追溯章节；本地验证适配器提供可重复结果。",
			inputs: [projectId],
			result: BID_OBJECT_TYPES.response
		},
		{
			id: BID_ACTIONS.submitReview,
			label: "提交人工审核",
			target: BID_OBJECT_TYPES.project,
			driver: "workflow",
			description: "创建审核对象并暂停流程。",
			inputs: [projectId, runId],
			result: BID_OBJECT_TYPES.review
		},
		{
			id: BID_ACTIONS.approveReview,
			label: "批准标书",
			target: BID_OBJECT_TYPES.review,
			driver: "human",
			description: "记录审核人和意见，并批准应答章节。",
			inputs: [
				projectId,
				{
					key: "reviewer",
					label: "审核人",
					type: "string",
					required: true
				},
				{
					key: "comment",
					label: "审核意见",
					type: "string"
				}
			],
			result: BID_OBJECT_TYPES.review
		},
		{
			id: BID_ACTIONS.exportDocument,
			label: "导出正式标书",
			target: BID_OBJECT_TYPES.project,
			driver: "workflow",
			description: "仅在审核批准后汇编正式 Markdown 制品。",
			inputs: [projectId],
			result: BID_OBJECT_TYPES.artifact
		},
		{
			id: BID_ACTIONS.runToReview,
			label: "运行完整生成流程",
			target: BID_OBJECT_TYPES.project,
			driver: "workflow",
			description: "从导入招标原文运行至人工审核闸口。",
			inputs: [projectId, {
				key: "tenderText",
				label: "招标原文",
				type: "string",
				required: true
			}],
			result: BID_OBJECT_TYPES.workflowRun
		}
	]
};
//#endregion
//#region lib/types/workflow.js
const BID_WORKFLOW_SCRIPT = `
for (const stepId of args.steps) {
  await activity('bid.execute-step', { stepId })
}
await activity('bid.submit-review', {})
return await activity('bid.finish-review', {})
`;
const EVIDENCE_CATALOG = [
	{
		title: "ISO 9001 质量管理体系认证",
		category: "资格",
		summary: "公司质量管理体系认证处于有效期内。",
		source: "企业资质库/ISO9001.pdf",
		keywords: "资质|认证|ISO|质量体系"
	},
	{
		title: "城市数据平台建设案例",
		category: "技术",
		summary: "已交付同类型城市数据治理与共享交换平台。",
		source: "企业案例库/城市数据平台.md",
		keywords: "案例|数据平台|数据治理|共享交换"
	},
	{
		title: "数据平台技术团队履历",
		category: "技术",
		summary: "核心团队覆盖架构、数据治理、安全和项目管理。",
		source: "企业人员库/核心团队.md",
		keywords: "团队|人员|架构师|项目经理|技术"
	},
	{
		title: "标准项目实施与交付方案",
		category: "交付",
		summary: "覆盖启动、调研、开发、试运行、验收和移交。",
		source: "企业方案库/实施交付.md",
		keywords: "实施|交付|工期|验收|培训"
	},
	{
		title: "三级售后服务保障方案",
		category: "服务",
		summary: "提供 7×24 服务台、分级响应和现场支持。",
		source: "企业方案库/售后服务.md",
		keywords: "售后|服务|响应|运维|保障"
	}
];
/**
* Build all Action adapters used by the local validation composition.
* @param startWorkflow - Starts the generic workflow run that coordinates the Actions.
* @returns Adapter map for one ontology definition registration.
*/
function createBidActionHandlers(startWorkflow) {
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
		[BID_ACTIONS.exportDocument]: exportDocument
	};
	handlers[BID_ACTIONS.runToReview] = async (input, ontology) => await runToReview(input, ontology, handlers, startWorkflow);
	return handlers;
}
/**
* Register read-only calculations separately from state-changing Actions.
* @returns Function adapter map for one ontology definition registration.
*/
function createBidFunctionHandlers() {
	return {
		[BID_FUNCTIONS.requirementsForProject]: (input, ontology) => Promise.resolve(objectsForProject(ontology, BID_OBJECT_TYPES.requirement, requiredString(input, "projectId"))),
		[BID_FUNCTIONS.evidenceCoverage]: (input, ontology) => {
			const projectId = requiredString(input, "projectId");
			const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, projectId);
			if (requirements.length === 0) return Promise.resolve(0);
			const matchedRequirementIds = new Set(objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, projectId).map((match) => stringProperty$1(match, "requirementId")));
			return Promise.resolve(matchedRequirementIds.size / requirements.length);
		},
		[BID_FUNCTIONS.unresolvedRiskCount]: (input, ontology) => Promise.resolve(objectsForProject(ontology, BID_OBJECT_TYPES.risk, requiredString(input, "projectId")).filter((risk) => !booleanProperty(risk, "resolved")).length)
	};
}
const createProject = async (input, ontology) => {
	const name = requiredString(input, "name");
	return await ontology.createObject({
		type: BID_OBJECT_TYPES.project,
		properties: {
			name,
			stage: "资料准备"
		}
	});
};
const importTender = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const existing = objectsForProject(ontology, BID_OBJECT_TYPES.tenderDocument, project.id)[0];
	if (existing !== void 0) return existing;
	const content = requiredString(input, "content");
	if (content.length < 20) throw new Error("bid-studio: tenderText must contain at least 20 characters");
	const title = optionalString(input, "title") ?? `${stringProperty$1(project, "name")}招标文件`;
	const document = await ontology.createObject({
		type: BID_OBJECT_TYPES.tenderDocument,
		properties: {
			projectId: project.id,
			title,
			sourceName: "工作台文本输入",
			content,
			status: "已导入"
		}
	});
	await ontology.createLink({
		type: BID_LINK_TYPES.projectDocument,
		from: project.id,
		to: document.id
	});
	await ontology.updateObject({
		id: project.id,
		properties: { stage: "解析中" }
	});
	return document;
};
const analyzeTender = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const existing = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
	if (existing[0] !== void 0) return existing[0];
	const document = objectsForProject(ontology, BID_OBJECT_TYPES.tenderDocument, project.id)[0];
	if (document === void 0) throw new Error(`bid-studio: project '${project.id}' has no tender document`);
	const lines = tenderLines(stringProperty$1(document, "content"));
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
				...score === void 0 ? {} : { score },
				status: "待匹配"
			}
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.documentRequirement,
			from: document.id,
			to: requirement.id
		});
		first ??= requirement;
		if (score !== void 0) {
			const criterion = await ontology.createObject({
				type: BID_OBJECT_TYPES.scoreCriterion,
				properties: {
					projectId: project.id,
					requirementId: requirement.id,
					title: line.text,
					score,
					source: `文本第 ${line.number} 行`
				}
			});
			await ontology.createLink({
				type: BID_LINK_TYPES.requirementScore,
				from: requirement.id,
				to: criterion.id
			});
		}
	}
	if (first === void 0) throw new Error("bid-studio: tender document contains no analyzable requirement lines");
	await ontology.updateObject({
		id: document.id,
		properties: { status: "已解析" }
	});
	return first;
};
const seedEvidence = async (_input, ontology) => {
	const existing = ontology.listObjects(BID_OBJECT_TYPES.evidence);
	let first = existing[0];
	for (const record of EVIDENCE_CATALOG) {
		if (existing.some((candidate) => stringProperty$1(candidate, "title") === record.title)) continue;
		const created = await ontology.createObject({
			type: BID_OBJECT_TYPES.evidence,
			properties: record
		});
		first ??= created;
	}
	if (first === void 0) throw new Error("bid-studio: evidence catalog did not produce any record");
	return first;
};
const matchEvidence = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
	const evidence = ontology.listObjects(BID_OBJECT_TYPES.evidence);
	if (requirements.length === 0) throw new Error(`bid-studio: project '${project.id}' has no requirements`);
	let first;
	for (const requirement of requirements) {
		const existing = objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, project.id).filter((candidate) => stringProperty$1(candidate, "requirementId") === requirement.id);
		if (existing[0] !== void 0) {
			first ??= existing[0];
			continue;
		}
		const selected = selectEvidence(requirement, evidence);
		if (selected === void 0) continue;
		const matched = await ontology.createObject({
			type: BID_OBJECT_TYPES.evidenceMatch,
			properties: {
				projectId: project.id,
				requirementId: requirement.id,
				evidenceId: selected.evidence.id,
				confidence: selected.confidence,
				rationale: selected.rationale,
				status: "已确认"
			}
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.requirementMatch,
			from: requirement.id,
			to: matched.id
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.evidenceMatch,
			from: selected.evidence.id,
			to: matched.id
		});
		first ??= matched;
		await ontology.updateObject({
			id: requirement.id,
			properties: { status: "已匹配" }
		});
	}
	await ontology.updateObject({
		id: project.id,
		properties: { stage: "证据匹配" }
	});
	return first ?? project;
};
const assessRisks = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
	const matches = objectsForProject(ontology, BID_OBJECT_TYPES.evidenceMatch, project.id);
	const risks = objectsForProject(ontology, BID_OBJECT_TYPES.risk, project.id);
	let first = risks[0];
	for (const requirement of requirements) {
		if (matches.some((candidate) => stringProperty$1(candidate, "requirementId") === requirement.id)) continue;
		const existing = risks.find((candidate) => stringProperty$1(candidate, "requirementId") === requirement.id);
		if (existing !== void 0) {
			first ??= existing;
			continue;
		}
		const mandatory = booleanProperty(requirement, "mandatory");
		const risk = await ontology.createObject({
			type: BID_OBJECT_TYPES.risk,
			properties: {
				projectId: project.id,
				requirementId: requirement.id,
				title: `证据缺口：${stringProperty$1(requirement, "title")}`,
				reason: "企业证据库中没有达到自动匹配阈值的材料。",
				severity: mandatory ? "高" : "中",
				resolved: false
			}
		});
		first ??= risk;
		const task = await ontology.createObject({
			type: BID_OBJECT_TYPES.task,
			properties: {
				projectId: project.id,
				riskId: risk.id,
				title: `补充材料：${stringProperty$1(requirement, "title")}`,
				owner: "投标负责人",
				status: "待处理"
			}
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.requirementRisk,
			from: requirement.id,
			to: risk.id
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.riskTask,
			from: risk.id,
			to: task.id
		});
		await ontology.updateObject({
			id: requirement.id,
			properties: { status: "存在缺口" }
		});
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
		const existing = objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id).find((candidate) => stringProperty$1(candidate, "requirementId") === requirement.id);
		if (existing !== void 0) {
			first ??= existing;
			continue;
		}
		const evidenceTitles = matches.filter((candidate) => stringProperty$1(candidate, "requirementId") === requirement.id).map((match) => evidence.find((candidate) => candidate.id === stringProperty$1(match, "evidenceId"))).filter((candidate) => candidate !== void 0).map((candidate) => stringProperty$1(candidate, "title"));
		const risk = risks.find((candidate) => stringProperty$1(candidate, "requirementId") === requirement.id);
		const response = await ontology.createObject({
			type: BID_OBJECT_TYPES.response,
			properties: {
				projectId: project.id,
				requirementId: requirement.id,
				title: `应答：${stringProperty$1(requirement, "title")}`,
				content: responseContent(requirement, evidenceTitles, risk),
				evidenceRefs: evidenceTitles.join("；") || "暂无，已创建补充材料任务",
				status: "待审核",
				approved: false
			}
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.requirementResponse,
			from: requirement.id,
			to: response.id
		});
		first ??= response;
		await ontology.updateObject({
			id: requirement.id,
			properties: { status: "已应答" }
		});
	}
	if (first === void 0) throw new Error(`bid-studio: project '${project.id}' has no generated responses`);
	await ontology.updateObject({
		id: project.id,
		properties: { stage: "应答生成" }
	});
	return first;
};
const submitReview = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const run = requireRun(input, ontology);
	const existing = objectsForProject(ontology, BID_OBJECT_TYPES.review, project.id)[0];
	if (existing !== void 0) return existing;
	if (objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id).length === 0) throw new Error(`bid-studio: project '${project.id}' has no responses to review`);
	const review = await ontology.createObject({
		type: BID_OBJECT_TYPES.review,
		properties: {
			projectId: project.id,
			runId: run.id,
			status: "待审核"
		}
	});
	await ontology.createLink({
		type: BID_LINK_TYPES.runReview,
		from: run.id,
		to: review.id
	});
	await ontology.updateObject({
		id: project.id,
		properties: { stage: "待人工审核" }
	});
	return review;
};
const approveReview = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const reviewer = requiredString(input, "reviewer");
	const review = objectsForProject(ontology, BID_OBJECT_TYPES.review, project.id)[0];
	if (review === void 0) throw new Error(`bid-studio: project '${project.id}' has no pending review`);
	const approved = await ontology.updateObject({
		id: review.id,
		properties: {
			status: "已批准",
			reviewer,
			comment: optionalString(input, "comment") ?? "内容、证据引用和风险说明已确认。"
		}
	});
	for (const response of objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id)) await ontology.updateObject({
		id: response.id,
		properties: {
			status: "已批准",
			approved: true
		}
	});
	const run = ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find((candidate) => candidate.id === stringProperty$1(review, "runId"));
	if (run !== void 0) {
		await updateStep(ontology, run.id, "review", "已完成", `由 ${reviewer} 审核通过`);
		await ontology.updateObject({
			id: run.id,
			properties: { currentStep: "export" }
		});
	}
	await ontology.updateObject({
		id: project.id,
		properties: { stage: "审核通过" }
	});
	return approved;
};
const exportDocument = async (input, ontology) => {
	const project = requireProject(input, ontology);
	const review = objectsForProject(ontology, BID_OBJECT_TYPES.review, project.id)[0];
	if (review === void 0 || stringProperty$1(review, "status") !== "已批准") throw new Error(`bid-studio: project '${project.id}' must pass human review before export`);
	const existing = objectsForProject(ontology, BID_OBJECT_TYPES.artifact, project.id).find((candidate) => stringProperty$1(candidate, "status") === "正式版");
	const runId = stringProperty$1(review, "runId");
	const artifact = existing ?? await ontology.createObject({
		type: BID_OBJECT_TYPES.artifact,
		properties: {
			projectId: project.id,
			runId,
			name: `${stringProperty$1(project, "name")}-正式标书.md`,
			format: "markdown",
			content: exportMarkdown(project, ontology),
			status: "正式版"
		}
	});
	if (existing === void 0) await ontology.createLink({
		type: BID_LINK_TYPES.projectArtifact,
		from: project.id,
		to: artifact.id
	});
	const run = ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find((candidate) => candidate.id === runId);
	if (run !== void 0) {
		await updateStep(ontology, run.id, "export", "已完成", "正式 Markdown 制品已汇编");
		await ontology.updateObject({
			id: run.id,
			properties: {
				status: "已完成",
				currentStep: "completed",
				completedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		});
	}
	await ontology.updateObject({
		id: project.id,
		properties: { stage: "已导出" }
	});
	return artifact;
};
async function runToReview(input, ontology, handlers, startWorkflow) {
	const project = requireProject(input, ontology);
	const tenderText = requiredString(input, "tenderText");
	const existing = objectsForProject(ontology, BID_OBJECT_TYPES.workflowRun, project.id)[0];
	if (existing !== void 0) return existing;
	const run = await ontology.createObject({
		type: BID_OBJECT_TYPES.workflowRun,
		properties: {
			projectId: project.id,
			workflowId: BID_WORKFLOW.id,
			status: "运行中",
			currentStep: "import",
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	});
	await ontology.createLink({
		type: BID_LINK_TYPES.projectRun,
		from: project.id,
		to: run.id
	});
	for (const [index, step] of BID_WORKFLOW.steps.entries()) {
		const stepObject = await ontology.createObject({
			type: BID_OBJECT_TYPES.workflowStep,
			properties: {
				projectId: project.id,
				runId: run.id,
				stepId: step.id,
				label: step.label,
				driver: step.driver,
				status: "待执行",
				sequence: index + 1
			}
		});
		await ontology.createLink({
			type: BID_LINK_TYPES.runStep,
			from: run.id,
			to: stepObject.id
		});
	}
	const automated = BID_WORKFLOW.steps.slice(0, 6);
	try {
		const workflow = startWorkflow({
			script: BID_WORKFLOW_SCRIPT,
			meta: {
				name: BID_WORKFLOW.id,
				description: BID_WORKFLOW.label
			},
			args: { steps: automated.map((step) => step.id) },
			activities: {
				"bid.execute-step": async (activityInput, signal) => {
					signal.throwIfAborted();
					const stepId = activityString(activityInput, "stepId");
					const step = automated.find((candidate) => candidate.id === stepId);
					if (step === void 0) throw new Error(`bid-studio: unknown automated workflow step '${stepId}'`);
					await updateStep(ontology, run.id, step.id, "执行中", step.description);
					await ontology.updateObject({
						id: run.id,
						properties: { currentStep: step.id }
					});
					const handler = handlers[step.action];
					if (handler === void 0) throw new Error(`bid-studio: workflow step '${step.id}' has no adapter`);
					await handler(step.id === "import" ? {
						projectId: project.id,
						title: `${stringProperty$1(project, "name")}招标文件`,
						content: tenderText
					} : { projectId: project.id }, ontology);
					await updateStep(ontology, run.id, step.id, "已完成", await stepResultDetail(step, project.id, ontology));
					return { stepId: step.id };
				},
				"bid.submit-review": async (_activityInput, signal) => {
					signal.throwIfAborted();
					return { reviewId: (await submitReview({
						projectId: project.id,
						runId: run.id
					}, ontology)).id };
				},
				"bid.finish-review": async (_activityInput, signal) => {
					signal.throwIfAborted();
					await updateStep(ontology, run.id, "review", "待人工", "等待审核人确认应答、证据引用和风险");
					return await ontology.updateObject({
						id: run.id,
						properties: {
							status: "待人工审核",
							currentStep: "review"
						}
					});
				}
			}
		});
		const result = await workflow.result;
		await workflow.dispose();
		if (result.stopReason !== "completed") throw new Error(result.error ?? `bid-studio: workflow stopped with ${result.stopReason}`);
		return requireRun({ runId: run.id }, ontology);
	} catch (error) {
		const current = stringProperty$1(ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find((candidate) => candidate.id === run.id) ?? run, "currentStep");
		await updateStep(ontology, run.id, current, "失败", error instanceof Error ? error.message : String(error));
		await ontology.updateObject({
			id: run.id,
			properties: { status: "失败" }
		});
		throw error;
	}
}
function activityString(input, key) {
	if (typeof input !== "object" || input === null || !(key in input)) throw new Error(`bid-studio: workflow activity requires '${key}'`);
	const value = input[key];
	if (typeof value !== "string" || value.length === 0) throw new Error(`bid-studio: workflow activity '${key}' must be a non-empty string`);
	return value;
}
function requireProject(input, ontology) {
	const projectId = requiredString(input, "projectId");
	const project = ontology.listObjects(BID_OBJECT_TYPES.project).find((candidate) => candidate.id === projectId);
	if (project === void 0) throw new Error(`bid-studio: project not found: ${projectId}`);
	return project;
}
function requireRun(input, ontology) {
	const runId = requiredString(input, "runId");
	const run = ontology.listObjects(BID_OBJECT_TYPES.workflowRun).find((candidate) => candidate.id === runId);
	if (run === void 0) throw new Error(`bid-studio: workflow run not found: ${runId}`);
	return run;
}
function requiredString(input, key) {
	const value = input[key];
	if (typeof value !== "string" || value.trim().length === 0) throw new Error(`bid-studio: ${key} must be a non-empty string`);
	return value.trim();
}
function optionalString(input, key) {
	const value = input[key];
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function stringProperty$1(object, key) {
	const value = object.properties[key];
	return typeof value === "string" ? value : "";
}
function booleanProperty(object, key) {
	return object.properties[key] === true;
}
function objectsForProject(ontology, type, projectId) {
	return ontology.listObjects(type).filter((candidate) => candidate.properties.projectId === projectId);
}
function tenderLines(content) {
	return content.split(/\r?\n/u).map((text, index) => ({
		number: index + 1,
		text: text.trim().replace(/^\s*(?:\d+[.、)]|[-*])\s*/u, "")
	})).filter((line) => line.text.length >= 6).slice(0, 12);
}
function scoreFrom(text) {
	const match = /(\d+(?:\.\d+)?)\s*分/u.exec(text);
	return match?.[1] === void 0 ? void 0 : Number(match[1]);
}
function classifyRequirement(text) {
	if (/资质|资格|认证|投标人/u.test(text)) return "资格";
	if (/交付|工期|实施|验收|培训/u.test(text)) return "交付";
	if (/报价|价格|付款|合同|商务/u.test(text)) return "商务";
	return "技术";
}
function selectEvidence(requirement, evidence) {
	const category = stringProperty$1(requirement, "category");
	const title = stringProperty$1(requirement, "title");
	const keyword = evidence.find((candidate) => stringProperty$1(candidate, "keywords").split("|").some((value) => value.length > 1 && title.includes(value)));
	if (keyword !== void 0) return {
		evidence: keyword,
		confidence: .94,
		rationale: "要求文本命中证据关键词。"
	};
	const exact = evidence.find((candidate) => stringProperty$1(candidate, "category") === category);
	return exact === void 0 ? void 0 : {
		evidence: exact,
		confidence: .86,
		rationale: `证据分类与${category}要求一致。`
	};
}
function responseContent(requirement, evidenceTitles, risk) {
	const title = stringProperty$1(requirement, "title");
	if (evidenceTitles.length === 0) return `我方已识别要求“${title}”，当前证据库尚无直接证明材料。该项按风险处理，并已创建补充材料任务，最终承诺以审核结论为准。`;
	return `我方完全响应要求“${title}”。现有${evidenceTitles.join("、")}可证明相关能力，实施过程中将按招标文件要求提交原件或可核验副本。${risk === void 0 ? "" : ` 已同步关注风险：${stringProperty$1(risk, "title")}。`}`;
}
function exportMarkdown(project, ontology) {
	const requirements = objectsForProject(ontology, BID_OBJECT_TYPES.requirement, project.id);
	const responses = objectsForProject(ontology, BID_OBJECT_TYPES.response, project.id);
	const risks = objectsForProject(ontology, BID_OBJECT_TYPES.risk, project.id);
	const approved = responses.filter((response) => booleanProperty(response, "approved")).length;
	return [
		`# ${stringProperty$1(project, "name")} — 投标文件`,
		"",
		"> 本制品由标准投标应答流程汇编，要求、证据、风险和章节保留本体对象引用。",
		"",
		"## 一、投标响应概览",
		"",
		`- 招标要求：${requirements.length} 项`,
		`- 已批准章节：${approved} 项`,
		`- 待闭环风险：${risks.filter((risk) => !booleanProperty(risk, "resolved")).length} 项`,
		"",
		"## 二、符合性矩阵",
		"",
		"| 序号 | 招标要求 | 分类 | 分值 | 响应状态 |",
		"| --- | --- | --- | ---: | --- |",
		...requirements.map((requirement, index) => {
			const score = requirement.properties.score;
			return `| ${index + 1} | ${stringProperty$1(requirement, "title").replaceAll("|", "\\|")} | ${stringProperty$1(requirement, "category")} | ${typeof score === "number" ? score : "-"} | ${stringProperty$1(requirement, "status")} |`;
		}),
		"",
		"## 三、详细应答",
		"",
		...responses.flatMap((response, index) => [
			`### 3.${index + 1} ${stringProperty$1(response, "title")}`,
			"",
			stringProperty$1(response, "content"),
			"",
			`证据引用：${stringProperty$1(response, "evidenceRefs")}`,
			""
		]),
		"## 四、风险与待办",
		"",
		...risks.length === 0 ? ["未识别到材料缺口。"] : risks.map((risk) => `- **${stringProperty$1(risk, "severity")}**：${stringProperty$1(risk, "title")}（${booleanProperty(risk, "resolved") ? "已解决" : "待处理"}）`),
		"",
		"## 五、审核结论",
		"",
		"应答章节、证据引用和风险说明已经人工审核，可进入正式排版与签章环节。",
		""
	].join("\n");
}
async function updateStep(ontology, runId, stepId, status, detail) {
	const step = ontology.listObjects(BID_OBJECT_TYPES.workflowStep).find((candidate) => candidate.properties.runId === runId && candidate.properties.stepId === stepId);
	if (step !== void 0) await ontology.updateObject({
		id: step.id,
		properties: {
			status,
			detail
		}
	});
}
async function stepResultDetail(step, projectId, ontology) {
	const count = step.produces.reduce((total, type) => {
		return total + (type === BID_OBJECT_TYPES.evidence ? ontology.listObjects(type) : objectsForProject(ontology, type, projectId)).length;
	}, 0);
	if (step.id === "match") {
		const coverage = await ontology.executeFunction(BID_FUNCTIONS.evidenceCoverage, { projectId });
		if (typeof coverage !== "number") throw new Error("bid-studio: evidence coverage Function returned a non-number");
		return `${step.label}完成，当前关联对象 ${count} 条，证据覆盖率 ${Math.round(coverage * 100)}%。`;
	}
	return `${step.label}完成，当前关联对象 ${count} 条。`;
}
//#endregion
//#region lib/types/index.js
/** Services required by the Host half. */
const inject = [
	"ontology",
	"tools",
	"workflowEngine"
];
/** Register the bid ontology, executable adapters, and model entry points. */
function apply(ctx) {
	ctx.effect(() => ctx.ontology.register(BID_ONTOLOGY, {
		actions: createBidActionHandlers((request) => ctx.workflowEngine.start(request)),
		functions: createBidFunctionHandlers()
	}), "bid-studio: ontology contribution");
	ctx.effect(() => ctx.tools.register(defineTool({
		name: "bid_create_project",
		description: "Create a durable local bid project that can be opened in Bid Studio.",
		parameters: { name: {
			type: "string",
			required: true,
			description: "Bid project name"
		} },
		output: {
			schema: {
				type: "object",
				properties: {
					projectId: {
						type: "string",
						required: true
					},
					name: {
						type: "string",
						required: true
					},
					stage: {
						type: "string",
						required: true
					}
				},
				additionalProperties: false
			},
			render: (_args, value) => [{
				type: "text",
				text: `Created bid project ${value.name} (${value.projectId}) in stage ${value.stage}.`
			}]
		},
		async execute(args, exec) {
			exec.signal.throwIfAborted();
			const project = await ctx.ontology.executeAction(CREATE_BID_PROJECT, { name: args.name });
			return {
				projectId: project.id,
				name: stringProperty(project, "name"),
				stage: stringProperty(project, "stage")
			};
		}
	})), "bid-studio: create-project tool");
	ctx.effect(() => ctx.tools.register(defineTool({
		name: "bid_run_to_review",
		description: ["Run tender intake, requirement analysis, evidence matching, risk assessment, and response generation,", "then stop for human review."].join(" "),
		parameters: {
			projectId: {
				type: "string",
				required: true,
				description: "Opaque bid project id"
			},
			tenderText: {
				type: "string",
				required: true,
				description: "Tender source text with one requirement per line when possible"
			}
		},
		output: {
			schema: {
				type: "object",
				properties: {
					runId: {
						type: "string",
						required: true
					},
					status: {
						type: "string",
						required: true
					},
					currentStep: {
						type: "string",
						required: true
					}
				},
				additionalProperties: false
			},
			render: (_args, value) => [{
				type: "text",
				text: `Bid workflow ${value.runId} is ${value.status} at ${value.currentStep}. Open Bid Studio for human review.`
			}]
		},
		async execute(args, exec) {
			exec.signal.throwIfAborted();
			const run = await ctx.ontology.executeAction(RUN_BID_TO_REVIEW, {
				projectId: args.projectId,
				tenderText: args.tenderText
			});
			return {
				runId: run.id,
				status: stringProperty(run, "status"),
				currentStep: stringProperty(run, "currentStep")
			};
		}
	})), "bid-studio: run-to-review tool");
	ctx.effect(() => ctx.tools.register(defineTool({
		name: "bid_export_document",
		description: "Export a formal Markdown bid artifact after the project has passed human review in Bid Studio.",
		parameters: { projectId: {
			type: "string",
			required: true,
			description: "Opaque bid project id"
		} },
		output: {
			schema: {
				type: "object",
				properties: {
					artifactId: {
						type: "string",
						required: true
					},
					name: {
						type: "string",
						required: true
					},
					format: {
						type: "string",
						required: true
					}
				},
				additionalProperties: false
			},
			render: (_args, value) => [{
				type: "text",
				text: `Exported ${value.name} (${value.artifactId}) as ${value.format}.`
			}]
		},
		async execute(args, exec) {
			exec.signal.throwIfAborted();
			const artifact = await ctx.ontology.executeAction(EXPORT_BID_DOCUMENT, { projectId: args.projectId });
			return {
				artifactId: artifact.id,
				name: stringProperty(artifact, "name"),
				format: stringProperty(artifact, "format")
			};
		}
	})), "bid-studio: export-document tool");
}
function stringProperty(object, key) {
	const value = object.properties[key];
	return typeof value === "string" ? value : "";
}
//#endregion
export { APPROVE_BID_REVIEW, BID_ACTIONS, BID_OBJECT_TYPES, BID_ONTOLOGY, BID_WORKFLOW, CREATE_BID_PROJECT, EXPORT_BID_DOCUMENT, RUN_BID_TO_REVIEW, apply, inject };
