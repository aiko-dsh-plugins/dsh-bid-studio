window.__ModuleLoader__.load({
	id: "aiko-dsh-bid-studio",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region \0dsh-css:D:\code\local\research\deepseek-harness\packages\business\bid-studio\src\client\BidStudio.module.css.mjs
		const css = ".UhJ_pG_page{height:100%;color:var(--dsw-alias-text-primary);background:linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-bg-base) 96%, #176b87), var(--dsw-alias-bg-base));padding:28px 32px 48px;overflow:auto}.UhJ_pG_header{justify-content:space-between;align-items:flex-start;gap:24px;max-width:1280px;margin:0 auto 24px;display:flex}.UhJ_pG_header h1{letter-spacing:-.03em;margin:4px 0 8px;font-size:30px}.UhJ_pG_header p,.UhJ_pG_panelTitle p{color:var(--dsw-alias-text-secondary);margin:0}.UhJ_pG_eyebrow{color:#1686a7;letter-spacing:.14em;font-size:11px;font-weight:700}.UhJ_pG_headerActions{flex-wrap:wrap;gap:10px;display:flex}.UhJ_pG_primary,.UhJ_pG_secondary{cursor:pointer;font:inherit;border-radius:9px;padding:9px 14px}.UhJ_pG_primary{color:#fff;background:#167c9d;border:1px solid #167c9d}.UhJ_pG_primary:disabled,.UhJ_pG_secondary:disabled{cursor:not-allowed;opacity:.5}.UhJ_pG_secondary{color:inherit;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1)}.UhJ_pG_error{color:#a62c2c;background:#a62c2c14;border:1px solid #a62c2c47;border-radius:10px;max-width:1280px;margin:0 auto 16px;padding:11px 14px}.UhJ_pG_metrics{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;max-width:1280px;margin:0 auto 16px;display:grid}.UhJ_pG_metrics article,.UhJ_pG_panel,.UhJ_pG_projectPanel,.UhJ_pG_executionPanel,.UhJ_pG_inspector{border:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent);border-radius:14px;box-shadow:0 6px 22px #0000000d}.UhJ_pG_metrics article{flex-direction:column;gap:3px;padding:18px;display:flex}.UhJ_pG_metrics strong{font-size:26px}.UhJ_pG_metrics span{color:var(--dsw-alias-text-secondary);font-size:13px}.UhJ_pG_workspace{grid-template-columns:minmax(250px,330px) minmax(0,1fr);gap:16px;max-width:1280px;min-height:480px;margin:0 auto 16px;display:grid}.UhJ_pG_projectPanel,.UhJ_pG_executionPanel{padding:18px}.UhJ_pG_panelTitle{justify-content:space-between;align-items:flex-start;gap:16px;display:flex}.UhJ_pG_panelTitle h2{margin:0 0 5px;font-size:17px}.UhJ_pG_panelTitle p{font-size:13px;line-height:1.5}.UhJ_pG_createRow{grid-template-columns:minmax(0,1fr) auto;gap:8px;margin:18px 0 10px;display:grid}.UhJ_pG_createRow input,.UhJ_pG_actionBar input{min-width:0;color:inherit;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);font:inherit;border-radius:9px;padding:9px 10px}.UhJ_pG_projectList{flex-direction:column;gap:7px;display:flex}.UhJ_pG_projectList button,.UhJ_pG_typeList button{text-align:left;width:100%;color:inherit;cursor:pointer;background:0 0;border:1px solid #0000;border-radius:9px;flex-direction:column;padding:10px 12px;display:flex}.UhJ_pG_projectList button:hover,.UhJ_pG_projectList button[data-active],.UhJ_pG_typeList button:hover,.UhJ_pG_typeList button[data-active]{background:#1686a717;border-color:#1686a73d}.UhJ_pG_projectList small,.UhJ_pG_typeList small{color:var(--dsw-alias-text-secondary);margin-top:3px}.UhJ_pG_empty{color:var(--dsw-alias-text-secondary);font-size:13px;line-height:1.6}.UhJ_pG_artifactTabs{gap:7px;margin:18px 0 10px;display:flex;overflow:auto}.UhJ_pG_artifactTabs button{color:inherit;white-space:nowrap;border:1px solid var(--dsw-alias-border-l1);cursor:pointer;background:0 0;border-radius:8px;padding:7px 10px}.UhJ_pG_artifactTabs button[data-active]{color:#167c9d;background:#167c9d14;border-color:#167c9d}.UhJ_pG_preview{white-space:pre-wrap;min-height:350px;color:var(--dsw-alias-text-primary);border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:0;padding:22px;font:14px/1.75 ui-monospace,SFMono-Regular,Consolas,monospace;overflow:auto}.UhJ_pG_panel{padding:20px}.UhJ_pG_page>.UhJ_pG_panel{max-width:1280px;margin:0 auto 16px}.UhJ_pG_badge{color:#1686a7;background:#1686a71f;border-radius:999px;padding:5px 9px;font-size:12px}.UhJ_pG_pipeline{grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;margin:22px 0 0;padding:0;list-style:none;display:grid}.UhJ_pG_pipeline li{background:var(--dsw-alias-bg-layer-1);border-radius:9px;align-items:center;gap:8px;padding:12px 10px;font-size:12px;display:flex}.UhJ_pG_pipeline li[data-status=已完成]{background:#34a38f1f}.UhJ_pG_pipeline li[data-status=待人工]{background:#e6992d21}.UhJ_pG_pipeline li[data-status=失败]{background:#a62c2c1a}.UhJ_pG_pipeline b{color:#1686a7;background:#1686a724;border-radius:50%;place-items:center;width:23px;height:23px;display:grid}.UhJ_pG_pipeline span{flex-direction:column;gap:3px;min-width:0;display:flex}.UhJ_pG_pipeline small{color:var(--dsw-alias-text-secondary)}.UhJ_pG_executionPanel textarea{box-sizing:border-box;resize:vertical;width:100%;min-height:210px;color:inherit;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;margin:18px 0 12px;padding:14px;font:13px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace}.UhJ_pG_executionPanel textarea:disabled{opacity:.7}.UhJ_pG_actionBar{flex-wrap:wrap;gap:8px;display:flex}.UhJ_pG_actionBar input{width:150px}.UhJ_pG_traceGrid{grid-template-columns:minmax(360px,.9fr) minmax(0,1.1fr);gap:16px;max-width:1280px;margin:0 auto 16px;display:grid}.UhJ_pG_traceList{flex-direction:column;gap:8px;max-height:430px;margin-top:16px;display:flex;overflow:auto}.UhJ_pG_traceList>div{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;grid-template-columns:auto minmax(0,1fr);align-items:flex-start;gap:10px;padding:11px;display:grid}.UhJ_pG_traceList strong,.UhJ_pG_traceList small{line-height:1.45;display:block}.UhJ_pG_traceList small{color:var(--dsw-alias-text-secondary);margin-top:4px}.UhJ_pG_category{color:#167c9d;background:#167c9d17;border-radius:999px;padding:3px 7px;font-size:11px}.UhJ_pG_inspector{max-width:1280px;margin:0 auto;padding:18px}.UhJ_pG_inspector summary{cursor:pointer;font-weight:600}.UhJ_pG_inspectorTabs{border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;gap:8px;margin-top:16px;padding-bottom:14px;display:flex}.UhJ_pG_inspectorTabs button{color:inherit;border:1px solid var(--dsw-alias-border-l1);cursor:pointer;background:0 0;border-radius:999px;padding:8px 12px}.UhJ_pG_inspectorTabs button[data-active]{color:#167c9d;background:#167c9d17;border-color:#167c9d}.UhJ_pG_inspectorTabs span{color:var(--dsw-alias-text-secondary);margin-left:5px}.UhJ_pG_ontology{grid-template-columns:minmax(220px,320px) minmax(0,1fr);gap:16px;margin-top:16px;display:grid}.UhJ_pG_typeList,.UhJ_pG_typeDetail{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;min-width:0;padding:12px}.UhJ_pG_typeList{max-height:620px;overflow:auto}.UhJ_pG_definitionId{color:#1686a7;margin-top:9px;display:inline-block}.UhJ_pG_definitionSubheading{margin:22px 0 10px;font-size:14px}.UhJ_pG_definitionMeta{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px;display:grid}.UhJ_pG_definitionMeta>div,.UhJ_pG_relationRoute>div,.UhJ_pG_outputList>div{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:5px;min-width:0;padding:14px;display:flex}.UhJ_pG_definitionMeta small,.UhJ_pG_relationRoute small,.UhJ_pG_outputList small{color:var(--dsw-alias-text-secondary)}.UhJ_pG_definitionMeta code,.UhJ_pG_relationRoute code,.UhJ_pG_outputList code{overflow-wrap:anywhere;color:#1686a7}.UhJ_pG_relationRoute{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:12px;margin-top:18px;display:grid}.UhJ_pG_relationRoute>span{color:#1686a7;font-size:24px}.UhJ_pG_outputList{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;display:grid}.UhJ_pG_propertyGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px;display:grid}.UhJ_pG_propertyGrid>div{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;grid-template-columns:minmax(100px,auto) 1fr auto;align-items:center;gap:12px;padding:13px;display:grid}.UhJ_pG_propertyGrid code{color:#1686a7}.UhJ_pG_propertyGrid small{color:var(--dsw-alias-text-secondary)}.UhJ_pG_nav{width:calc(100% - 16px);min-height:38px;color:var(--dsw-alias-text-primary);cursor:pointer;white-space:nowrap;background:0 0;border:1px solid #0000;border-radius:9px;align-items:center;gap:10px;margin:4px 8px;padding:7px 10px;display:flex}.UhJ_pG_nav:hover,.UhJ_pG_nav[data-active]{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l1)}.UhJ_pG_navIcon{color:#fff;background:linear-gradient(135deg,#1686a7,#34a38f);border-radius:7px;flex:0 0 22px;place-items:center;width:22px;height:22px;font-size:12px;font-weight:700;display:grid}@media (width<=1100px){.UhJ_pG_pipeline{grid-template-columns:repeat(4,1fr)}}@media (width<=900px){.UhJ_pG_metrics,.UhJ_pG_pipeline{grid-template-columns:repeat(2,1fr)}.UhJ_pG_workspace,.UhJ_pG_ontology,.UhJ_pG_traceGrid{grid-template-columns:1fr}.UhJ_pG_header,.UhJ_pG_panelTitle{flex-direction:column}}";
		const tagId = "aiko-dsh-bid-studio/BidStudio.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "aiko-dsh-bid-studio";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var BidStudio_module_css_default = {
			"actionBar": "UhJ_pG_actionBar",
			"artifactTabs": "UhJ_pG_artifactTabs",
			"badge": "UhJ_pG_badge",
			"category": "UhJ_pG_category",
			"createRow": "UhJ_pG_createRow",
			"definitionId": "UhJ_pG_definitionId",
			"definitionMeta": "UhJ_pG_definitionMeta",
			"definitionSubheading": "UhJ_pG_definitionSubheading",
			"empty": "UhJ_pG_empty",
			"error": "UhJ_pG_error",
			"executionPanel": "UhJ_pG_executionPanel",
			"eyebrow": "UhJ_pG_eyebrow",
			"header": "UhJ_pG_header",
			"headerActions": "UhJ_pG_headerActions",
			"inspector": "UhJ_pG_inspector",
			"inspectorTabs": "UhJ_pG_inspectorTabs",
			"metrics": "UhJ_pG_metrics",
			"nav": "UhJ_pG_nav",
			"navIcon": "UhJ_pG_navIcon",
			"ontology": "UhJ_pG_ontology",
			"outputList": "UhJ_pG_outputList",
			"page": "UhJ_pG_page",
			"panel": "UhJ_pG_panel",
			"panelTitle": "UhJ_pG_panelTitle",
			"pipeline": "UhJ_pG_pipeline",
			"preview": "UhJ_pG_preview",
			"primary": "UhJ_pG_primary",
			"projectList": "UhJ_pG_projectList",
			"projectPanel": "UhJ_pG_projectPanel",
			"propertyGrid": "UhJ_pG_propertyGrid",
			"relationRoute": "UhJ_pG_relationRoute",
			"secondary": "UhJ_pG_secondary",
			"traceGrid": "UhJ_pG_traceGrid",
			"traceList": "UhJ_pG_traceList",
			"typeDetail": "UhJ_pG_typeDetail",
			"typeList": "UhJ_pG_typeList",
			"workspace": "UhJ_pG_workspace"
		};
		//#endregion
		//#region lib/types/client/BidNavigation.js
		/** Render the wide or compact bid-workbench navigation button. */
		function BidNavigation({ wide, applicationId, open, useLayout }) {
			const active = useLayout((snapshot) => snapshot.activeApplication === applicationId);
			return (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: BidStudio_module_css_default.nav,
				"data-active": active || void 0,
				"aria-label": "投标工作台",
				"aria-current": active ? "page" : void 0,
				onClick: open,
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: BidStudio_module_css_default.navIcon,
					"aria-hidden": "true",
					children: "标"
				}), wide && (0, react_jsx_runtime.jsx)("span", { children: "投标工作台" })]
			});
		}
		//#endregion
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
		//#region lib/types/client/OntologyInspector.js
		/** Interactive view of every object, relationship, Function, Action, and process definition. */
		/** Render the complete installable definition instead of only its object properties. */
		function OntologyInspector({ definition }) {
			const [section, setSection] = (0, react.useState)("objects");
			const [selectedTypeId, setSelectedTypeId] = (0, react.useState)(definition.objectTypes[0]?.id);
			const [selectedLinkId, setSelectedLinkId] = (0, react.useState)(definition.linkTypes[0]?.id);
			const [selectedFunctionId, setSelectedFunctionId] = (0, react.useState)(definition.functions[0]?.id);
			const [selectedActionId, setSelectedActionId] = (0, react.useState)(definition.actions[0]?.id);
			const [selectedStepId, setSelectedStepId] = (0, react.useState)(BID_WORKFLOW.steps[0]?.id);
			const selectedType = definition.objectTypes.find((type) => type.id === selectedTypeId);
			const selectedLink = definition.linkTypes.find((link) => link.id === selectedLinkId);
			const selectedFunction = definition.functions.find((functionDefinition) => functionDefinition.id === selectedFunctionId);
			const selectedAction = definition.actions.find((action) => action.id === selectedActionId);
			const selectedStep = BID_WORKFLOW.steps.find((step) => step.id === selectedStepId);
			return (0, react_jsx_runtime.jsxs)("details", {
				className: BidStudio_module_css_default.inspector,
				"aria-label": "标书本体定义",
				children: [
					(0, react_jsx_runtime.jsxs)("summary", { children: [
						"查看完整标书本体定义（",
						definition.objectTypes.length,
						" 个对象类型、",
						definition.linkTypes.length,
						" 个关系、",
						definition.functions.length,
						" 个 Function、",
						definition.actions.length,
						" 个 Action）"
					] }),
					(0, react_jsx_runtime.jsxs)("nav", {
						className: BidStudio_module_css_default.inspectorTabs,
						"aria-label": "本体定义视图",
						children: [
							(0, react_jsx_runtime.jsx)(InspectorTab, {
								active: section === "objects",
								onClick: () => {
									setSection("objects");
								},
								label: "对象类型",
								count: definition.objectTypes.length
							}),
							(0, react_jsx_runtime.jsx)(InspectorTab, {
								active: section === "links",
								onClick: () => {
									setSection("links");
								},
								label: "关系定义",
								count: definition.linkTypes.length
							}),
							(0, react_jsx_runtime.jsx)(InspectorTab, {
								active: section === "functions",
								onClick: () => {
									setSection("functions");
								},
								label: "Function 定义",
								count: definition.functions.length
							}),
							(0, react_jsx_runtime.jsx)(InspectorTab, {
								active: section === "actions",
								onClick: () => {
									setSection("actions");
								},
								label: "Action 定义",
								count: definition.actions.length
							}),
							(0, react_jsx_runtime.jsx)(InspectorTab, {
								active: section === "workflow",
								onClick: () => {
									setSection("workflow");
								},
								label: "运行流程",
								count: BID_WORKFLOW.steps.length
							})
						]
					}),
					section === "objects" && (0, react_jsx_runtime.jsxs)("div", {
						className: BidStudio_module_css_default.ontology,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeList,
							children: definition.objectTypes.map((type) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-active": selectedTypeId === type.id || void 0,
								onClick: () => {
									setSelectedTypeId(type.id);
								},
								children: [(0, react_jsx_runtime.jsx)("span", { children: type.label }), (0, react_jsx_runtime.jsx)("small", { children: type.id })]
							}, type.id))
						}), (0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeDetail,
							children: selectedType !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(DefinitionHeading, {
								title: selectedType.label,
								description: selectedType.description,
								id: selectedType.id
							}), (0, react_jsx_runtime.jsx)("div", {
								className: BidStudio_module_css_default.propertyGrid,
								children: selectedType.properties.map((property) => (0, react_jsx_runtime.jsxs)("div", { children: [
									(0, react_jsx_runtime.jsx)("code", { children: property.key }),
									(0, react_jsx_runtime.jsx)("span", { children: property.label }),
									(0, react_jsx_runtime.jsxs)("small", { children: [
										property.type,
										property.required ? " · 必填" : "",
										formatValues(property.values)
									] })
								] }, property.key))
							})] })
						})]
					}),
					section === "functions" && (0, react_jsx_runtime.jsxs)("div", {
						className: BidStudio_module_css_default.ontology,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeList,
							children: definition.functions.map((functionDefinition) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-active": selectedFunctionId === functionDefinition.id || void 0,
								onClick: () => {
									setSelectedFunctionId(functionDefinition.id);
								},
								children: [(0, react_jsx_runtime.jsx)("span", { children: functionDefinition.label }), (0, react_jsx_runtime.jsx)("small", { children: functionDefinition.id })]
							}, functionDefinition.id))
						}), (0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeDetail,
							children: selectedFunction !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)(DefinitionHeading, {
									title: selectedFunction.label,
									description: selectedFunction.description,
									id: selectedFunction.id,
									badge: "只读计算"
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: BidStudio_module_css_default.definitionMeta,
									children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("small", { children: "返回类型" }), (0, react_jsx_runtime.jsx)("strong", { children: functionResultLabel(selectedFunction.result, definition) })] })
								}),
								(0, react_jsx_runtime.jsx)("h3", {
									className: BidStudio_module_css_default.definitionSubheading,
									children: "输入参数"
								}),
								selectedFunction.inputs === void 0 || selectedFunction.inputs.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
									className: BidStudio_module_css_default.empty,
									children: "无需输入参数。"
								}) : (0, react_jsx_runtime.jsx)("div", {
									className: BidStudio_module_css_default.propertyGrid,
									children: selectedFunction.inputs.map((input) => (0, react_jsx_runtime.jsxs)("div", { children: [
										(0, react_jsx_runtime.jsx)("code", { children: input.key }),
										(0, react_jsx_runtime.jsx)("span", { children: input.label }),
										(0, react_jsx_runtime.jsxs)("small", { children: [
											input.type,
											input.required ? " · 必填" : "",
											formatValues(input.values)
										] })
									] }, input.key))
								})
							] })
						})]
					}),
					section === "links" && (0, react_jsx_runtime.jsxs)("div", {
						className: BidStudio_module_css_default.ontology,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeList,
							children: definition.linkTypes.map((link) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-active": selectedLinkId === link.id || void 0,
								onClick: () => {
									setSelectedLinkId(link.id);
								},
								children: [(0, react_jsx_runtime.jsx)("span", { children: link.label }), (0, react_jsx_runtime.jsx)("small", { children: link.id })]
							}, link.id))
						}), (0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeDetail,
							children: selectedLink !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)(DefinitionHeading, {
									title: selectedLink.label,
									description: selectedLink.description ?? "连接两个业务对象类型。",
									id: selectedLink.id
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.relationRoute,
									children: [
										(0, react_jsx_runtime.jsx)(ObjectReference, {
											label: "来源对象",
											typeId: selectedLink.from,
											definition
										}),
										(0, react_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "→"
										}),
										(0, react_jsx_runtime.jsx)(ObjectReference, {
											label: "目标对象",
											typeId: selectedLink.to,
											definition
										})
									]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.definitionMeta,
									children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("small", { children: "关系基数" }), (0, react_jsx_runtime.jsx)("strong", { children: cardinalityLabel(selectedLink.cardinality) })] }), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("small", { children: "方向" }), (0, react_jsx_runtime.jsx)("strong", { children: "从来源对象指向目标对象" })] })]
								})
							] })
						})]
					}),
					section === "actions" && (0, react_jsx_runtime.jsxs)("div", {
						className: BidStudio_module_css_default.ontology,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeList,
							children: definition.actions.map((action) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-active": selectedActionId === action.id || void 0,
								onClick: () => {
									setSelectedActionId(action.id);
								},
								children: [(0, react_jsx_runtime.jsx)("span", { children: action.label }), (0, react_jsx_runtime.jsxs)("small", { children: [
									driverLabel$1(action.driver),
									" · ",
									action.id
								] })]
							}, action.id))
						}), (0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeDetail,
							children: selectedAction !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)(DefinitionHeading, {
									title: selectedAction.label,
									description: selectedAction.description,
									id: selectedAction.id,
									badge: `${driverLabel$1(selectedAction.driver)}驱动`
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.definitionMeta,
									children: [(0, react_jsx_runtime.jsx)(DefinitionReference, {
										label: "作用对象",
										typeId: selectedAction.target,
										definition
									}), (0, react_jsx_runtime.jsx)(DefinitionReference, {
										label: "返回对象",
										typeId: selectedAction.result,
										definition
									})]
								}),
								(0, react_jsx_runtime.jsx)("h3", {
									className: BidStudio_module_css_default.definitionSubheading,
									children: "输入参数"
								}),
								selectedAction.inputs === void 0 || selectedAction.inputs.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
									className: BidStudio_module_css_default.empty,
									children: "无需输入参数。"
								}) : (0, react_jsx_runtime.jsx)("div", {
									className: BidStudio_module_css_default.propertyGrid,
									children: selectedAction.inputs.map((input) => (0, react_jsx_runtime.jsxs)("div", { children: [
										(0, react_jsx_runtime.jsx)("code", { children: input.key }),
										(0, react_jsx_runtime.jsx)("span", { children: input.label }),
										(0, react_jsx_runtime.jsxs)("small", { children: [
											input.type,
											input.required ? " · 必填" : "",
											formatValues(input.values)
										] })
									] }, input.key))
								})
							] })
						})]
					}),
					section === "workflow" && (0, react_jsx_runtime.jsxs)("div", {
						className: BidStudio_module_css_default.ontology,
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeList,
							children: BID_WORKFLOW.steps.map((step, index) => (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-active": selectedStepId === step.id || void 0,
								onClick: () => {
									setSelectedStepId(step.id);
								},
								children: [(0, react_jsx_runtime.jsxs)("span", { children: [
									index + 1,
									". ",
									step.label
								] }), (0, react_jsx_runtime.jsxs)("small", { children: [
									driverLabel$1(step.driver),
									" · ",
									step.action
								] })]
							}, step.id))
						}), (0, react_jsx_runtime.jsx)("div", {
							className: BidStudio_module_css_default.typeDetail,
							children: selectedStep !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								(0, react_jsx_runtime.jsx)(DefinitionHeading, {
									title: BID_WORKFLOW.label,
									description: `步骤 ${BID_WORKFLOW.steps.findIndex((step) => step.id === selectedStep.id) + 1}：${selectedStep.description}`,
									id: `${BID_WORKFLOW.id}@${BID_WORKFLOW.version}`,
									badge: driverLabel$1(selectedStep.driver)
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.definitionMeta,
									children: [(0, react_jsx_runtime.jsxs)("div", { children: [
										(0, react_jsx_runtime.jsx)("small", { children: "流程步骤" }),
										(0, react_jsx_runtime.jsx)("strong", { children: selectedStep.label }),
										(0, react_jsx_runtime.jsx)("code", { children: selectedStep.id })
									] }), (0, react_jsx_runtime.jsxs)("div", { children: [
										(0, react_jsx_runtime.jsx)("small", { children: "执行 Action" }),
										(0, react_jsx_runtime.jsx)("strong", { children: definition.actions.find((action) => action.id === selectedStep.action)?.label ?? selectedStep.action }),
										(0, react_jsx_runtime.jsx)("code", { children: selectedStep.action })
									] })]
								}),
								(0, react_jsx_runtime.jsx)("h3", {
									className: BidStudio_module_css_default.definitionSubheading,
									children: "产出对象"
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: BidStudio_module_css_default.outputList,
									children: selectedStep.produces.map((typeId) => (0, react_jsx_runtime.jsx)(ObjectReference, {
										label: "产出",
										typeId,
										definition
									}, typeId))
								})
							] })
						})]
					})
				]
			});
		}
		function InspectorTab({ active, onClick, label, count }) {
			return (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-active": active || void 0,
				onClick,
				children: [
					label,
					" ",
					(0, react_jsx_runtime.jsx)("span", { children: count })
				]
			});
		}
		function DefinitionHeading({ title, description, id, badge }) {
			return (0, react_jsx_runtime.jsxs)("div", {
				className: BidStudio_module_css_default.panelTitle,
				children: [(0, react_jsx_runtime.jsxs)("div", { children: [
					(0, react_jsx_runtime.jsx)("h2", { children: title }),
					(0, react_jsx_runtime.jsx)("p", { children: description }),
					(0, react_jsx_runtime.jsx)("code", {
						className: BidStudio_module_css_default.definitionId,
						children: id
					})
				] }), badge !== void 0 && (0, react_jsx_runtime.jsx)("span", {
					className: BidStudio_module_css_default.badge,
					children: badge
				})]
			});
		}
		function ObjectReference({ label, typeId, definition }) {
			const type = definition.objectTypes.find((candidate) => candidate.id === typeId);
			return (0, react_jsx_runtime.jsxs)("div", { children: [
				(0, react_jsx_runtime.jsx)("small", { children: label }),
				(0, react_jsx_runtime.jsx)("strong", { children: type?.label ?? typeId }),
				(0, react_jsx_runtime.jsx)("code", { children: typeId })
			] });
		}
		function DefinitionReference({ label, typeId, definition }) {
			if (typeId === void 0) return (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("small", { children: label }), (0, react_jsx_runtime.jsx)("strong", { children: "无" })] });
			return (0, react_jsx_runtime.jsx)(ObjectReference, {
				label,
				typeId,
				definition
			});
		}
		function formatValues(values) {
			return values === void 0 ? "" : ` · ${values.join(" / ")}`;
		}
		function cardinalityLabel(cardinality) {
			return {
				"one-to-one": "一对一",
				"one-to-many": "一对多",
				"many-to-many": "多对多"
			}[cardinality ?? "one-to-many"];
		}
		function functionResultLabel(result, definition) {
			if (result.kind === "scalar") return result.type;
			return `${definition.objectTypes.find((type) => type.id === result.objectType)?.label ?? result.objectType}${result.kind === "object-list" ? "列表" : ""}`;
		}
		function driverLabel$1(driver) {
			return {
				machine: "机器",
				workflow: "工作流",
				agent: "AI Agent",
				human: "人工"
			}[driver] ?? driver;
		}
		//#endregion
		//#region lib/types/client/BidStudio.js
		/** Durable Bid Studio workbench for the complete standard response route. */
		const DEFAULT_TENDER = [
			"1. 投标人必须具备有效的 ISO 9001 质量管理体系认证，5分。",
			"2. 提供城市数据平台或数据治理同类项目案例，10分。",
			"3. 技术方案应覆盖数据采集、治理、共享交换和安全体系，20分。",
			"4. 项目必须在合同签订后 90 日内完成实施交付和验收，10分。",
			"5. 项目团队须包含项目经理、数据架构师和安全工程师，10分。",
			"6. 投标报价不得超过采购预算，商务报价得分15分。"
		].join("\n");
		/** Render the operational workbench and its secondary ontology inspector. */
		function BidStudio({ definition, remote, close }) {
			const [records, setRecords] = (0, react.useState)({});
			const [projectId, setProjectId] = (0, react.useState)();
			const [artifactId, setArtifactId] = (0, react.useState)();
			const [projectName, setProjectName] = (0, react.useState)("城市数据平台投标项目");
			const [tenderText, setTenderText] = (0, react.useState)(DEFAULT_TENDER);
			const [reviewer, setReviewer] = (0, react.useState)("项目负责人");
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)();
			const refresh = (0, react.useCallback)(async () => {
				const entries = await Promise.all(Object.values(BID_OBJECT_TYPES).map(async (type) => [type, await remote.listObjects(type)]));
				const next = Object.fromEntries(entries);
				setRecords(next);
				const projects = next[BID_OBJECT_TYPES.project] ?? [];
				setProjectId((current) => current ?? projects[0]?.id);
			}, [remote]);
			(0, react.useEffect)(() => {
				let active = true;
				refresh().catch((reason) => {
					if (active) setError(reason instanceof Error ? reason.message : String(reason));
				});
				return () => {
					active = false;
				};
			}, [refresh]);
			const projects = ofType(records, BID_OBJECT_TYPES.project);
			const selectedProject = projects.find((project) => project.id === projectId);
			const requirements = forProject(records, BID_OBJECT_TYPES.requirement, projectId);
			const matches = forProject(records, BID_OBJECT_TYPES.evidenceMatch, projectId);
			const risks = forProject(records, BID_OBJECT_TYPES.risk, projectId);
			const responses = forProject(records, BID_OBJECT_TYPES.response, projectId);
			const reviews = forProject(records, BID_OBJECT_TYPES.review, projectId);
			const artifacts = forProject(records, BID_OBJECT_TYPES.artifact, projectId);
			const currentRun = forProject(records, BID_OBJECT_TYPES.workflowRun, projectId)[0];
			const steps = (0, react.useMemo)(() => ofType(records, BID_OBJECT_TYPES.workflowStep).filter((step) => step.properties.runId === currentRun?.id).toSorted((left, right) => numberProperty(left, "sequence") - numberProperty(right, "sequence")), [currentRun?.id, records]);
			const selectedReview = reviews[0];
			const selectedArtifact = artifacts.find((artifact) => artifact.id === artifactId) ?? artifacts.find((artifact) => stringProperty(artifact, "status") === "正式版") ?? artifacts[artifacts.length - 1];
			async function runAction(action, input) {
				setBusy(true);
				setError(void 0);
				try {
					const result = await remote.execute(action, input);
					await refresh();
					return result;
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
					return;
				} finally {
					setBusy(false);
				}
			}
			async function createProject() {
				const created = await runAction(CREATE_BID_PROJECT, { name: projectName });
				if (isOntologyObject(created)) setProjectId(created.id);
			}
			async function runWorkflow() {
				if (selectedProject === void 0) return;
				await runAction(RUN_BID_TO_REVIEW, {
					projectId: selectedProject.id,
					tenderText
				});
			}
			async function approveReview() {
				if (selectedProject === void 0) return;
				await runAction(APPROVE_BID_REVIEW, {
					projectId: selectedProject.id,
					reviewer,
					comment: "已核对要求、证据引用、风险和应答内容，同意导出。"
				});
			}
			async function exportDocument() {
				if (selectedProject === void 0) return;
				const artifact = await runAction(EXPORT_BID_DOCUMENT, { projectId: selectedProject.id });
				if (isOntologyObject(artifact)) setArtifactId(artifact.id);
			}
			function downloadArtifact() {
				if (selectedArtifact === void 0) return;
				const url = URL.createObjectURL(new Blob([stringProperty(selectedArtifact, "content")], { type: "text/markdown;charset=utf-8" }));
				const anchor = document.createElement("a");
				anchor.href = url;
				anchor.download = stringProperty(selectedArtifact, "name") || "bid.md";
				anchor.click();
				URL.revokeObjectURL(url);
			}
			const reviewApproved = selectedReview !== void 0 && stringProperty(selectedReview, "status") === "已批准";
			return (0, react_jsx_runtime.jsxs)("main", {
				className: BidStudio_module_css_default.page,
				children: [
					(0, react_jsx_runtime.jsxs)("header", {
						className: BidStudio_module_css_default.header,
						children: [(0, react_jsx_runtime.jsxs)("div", { children: [
							(0, react_jsx_runtime.jsx)("div", {
								className: BidStudio_module_css_default.eyebrow,
								children: "LOCAL ONTOLOGY APPLICATION"
							}),
							(0, react_jsx_runtime.jsx)("h1", { children: "投标工作台" }),
							(0, react_jsx_runtime.jsx)("p", { children: "标准流程把招标原文转成可追溯要求、证据、风险、应答、审核记录和正式制品。" })
						] }), (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: BidStudio_module_css_default.secondary,
							onClick: close,
							children: "返回对话"
						})]
					}),
					error !== void 0 && (0, react_jsx_runtime.jsx)("div", {
						className: BidStudio_module_css_default.error,
						role: "alert",
						children: error
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: BidStudio_module_css_default.metrics,
						"aria-label": "项目概览",
						children: [
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsx)("strong", { children: requirements.length }), (0, react_jsx_runtime.jsx)("span", { children: "招标要求" })] }),
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsx)("strong", { children: matches.length }), (0, react_jsx_runtime.jsx)("span", { children: "证据匹配" })] }),
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsx)("strong", { children: risks.filter((risk) => risk.properties.resolved !== true).length }), (0, react_jsx_runtime.jsx)("span", { children: "待闭环风险" })] }),
							(0, react_jsx_runtime.jsxs)("article", { children: [(0, react_jsx_runtime.jsxs)("strong", { children: [
								responses.filter((response) => response.properties.approved === true).length,
								"/",
								responses.length
							] }), (0, react_jsx_runtime.jsx)("span", { children: "已批准章节" })] })
						]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: BidStudio_module_css_default.workspace,
						children: [(0, react_jsx_runtime.jsxs)("aside", {
							className: BidStudio_module_css_default.projectPanel,
							children: [
								(0, react_jsx_runtime.jsx)("div", {
									className: BidStudio_module_css_default.panelTitle,
									children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: "投标项目" }), (0, react_jsx_runtime.jsx)("p", { children: "项目和流程记录持久化在本机。" })] })
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.createRow,
									children: [(0, react_jsx_runtime.jsx)("input", {
										"aria-label": "项目名称",
										value: projectName,
										onChange: (event) => {
											setProjectName(event.target.value);
										}
									}), (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: BidStudio_module_css_default.primary,
										disabled: busy || projectName.trim().length === 0,
										onClick: () => {
											createProject();
										},
										children: "新建"
									})]
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.projectList,
									children: [projects.length === 0 && (0, react_jsx_runtime.jsx)("p", {
										className: BidStudio_module_css_default.empty,
										children: "先新建项目，再输入招标原文运行完整流程。"
									}), projects.map((project) => (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-active": project.id === projectId || void 0,
										onClick: () => {
											setProjectId(project.id);
											setArtifactId(void 0);
										},
										children: [(0, react_jsx_runtime.jsx)("span", { children: stringProperty(project, "name") }), (0, react_jsx_runtime.jsx)("small", { children: stringProperty(project, "stage") })]
									}, project.id))]
								})
							]
						}), (0, react_jsx_runtime.jsxs)("section", {
							className: BidStudio_module_css_default.executionPanel,
							children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.panelTitle,
									children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: "招标原文与执行" }), (0, react_jsx_runtime.jsx)("p", { children: "每行一个要求时，本地验证解析器可以给出最清晰的追溯结果。" })] }), (0, react_jsx_runtime.jsx)("span", {
										className: BidStudio_module_css_default.badge,
										children: currentRun === void 0 ? "尚未运行" : stringProperty(currentRun, "status")
									})]
								}),
								(0, react_jsx_runtime.jsx)("textarea", {
									"aria-label": "招标原文",
									value: tenderText,
									onChange: (event) => {
										setTenderText(event.target.value);
									},
									disabled: currentRun !== void 0
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.actionBar,
									children: [
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: BidStudio_module_css_default.primary,
											disabled: busy || selectedProject === void 0 || currentRun !== void 0 || tenderText.trim().length < 20,
											onClick: () => {
												runWorkflow();
											},
											children: "运行到人工审核"
										}),
										(0, react_jsx_runtime.jsx)("input", {
											"aria-label": "审核人",
											value: reviewer,
											onChange: (event) => {
												setReviewer(event.target.value);
											}
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: BidStudio_module_css_default.secondary,
											disabled: busy || selectedReview === void 0 || reviewApproved || reviewer.trim().length === 0,
											onClick: () => {
												approveReview();
											},
											children: "审核通过"
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: BidStudio_module_css_default.primary,
											disabled: busy || !reviewApproved,
											onClick: () => {
												exportDocument();
											},
											children: "导出正式标书"
										})
									]
								})
							]
						})]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: BidStudio_module_css_default.panel,
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: BidStudio_module_css_default.panelTitle,
							children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: BID_WORKFLOW.label }), (0, react_jsx_runtime.jsx)("p", { children: "驱动者来自流程定义；Agent 节点当前使用可重复的本地验证适配器。" })] }), (0, react_jsx_runtime.jsxs)("span", {
								className: BidStudio_module_css_default.badge,
								children: ["v", BID_WORKFLOW.version]
							})]
						}), (0, react_jsx_runtime.jsx)("ol", {
							className: BidStudio_module_css_default.pipeline,
							children: BID_WORKFLOW.steps.map((definitionStep, index) => {
								const step = steps.find((candidate) => candidate.properties.stepId === definitionStep.id);
								const status = step === void 0 ? "待执行" : stringProperty(step, "status");
								return (0, react_jsx_runtime.jsxs)("li", {
									"data-status": status,
									children: [(0, react_jsx_runtime.jsx)("b", { children: index + 1 }), (0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("strong", { children: definitionStep.label }), (0, react_jsx_runtime.jsxs)("small", { children: [
										driverLabel(definitionStep.driver),
										" · ",
										status
									] })] })]
								}, definitionStep.id);
							})
						})]
					}),
					(0, react_jsx_runtime.jsxs)("section", {
						className: BidStudio_module_css_default.traceGrid,
						children: [(0, react_jsx_runtime.jsxs)("article", {
							className: BidStudio_module_css_default.panel,
							children: [(0, react_jsx_runtime.jsx)("div", {
								className: BidStudio_module_css_default.panelTitle,
								children: (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: "要求与应答追溯" }), (0, react_jsx_runtime.jsx)("p", { children: "每条要求显示分类、分值、证据和风险状态。" })] })
							}), (0, react_jsx_runtime.jsx)("div", {
								className: BidStudio_module_css_default.traceList,
								children: requirements.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
									className: BidStudio_module_css_default.empty,
									children: "流程运行后显示解析结果。"
								}) : requirements.map((requirement) => {
									const matchCount = matches.filter((match) => match.properties.requirementId === requirement.id).length;
									const risk = risks.find((candidate) => candidate.properties.requirementId === requirement.id);
									const response = responses.find((candidate) => candidate.properties.requirementId === requirement.id);
									return (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", {
										className: BidStudio_module_css_default.category,
										children: stringProperty(requirement, "category")
									}), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("strong", { children: stringProperty(requirement, "title") }), (0, react_jsx_runtime.jsxs)("small", { children: [
										stringProperty(requirement, "source"),
										" ·",
										typeof requirement.properties.score === "number" ? ` ${requirement.properties.score} 分` : " 无评分",
										" · 证据 ",
										matchCount,
										" · ",
										risk === void 0 ? "无缺口" : stringProperty(risk, "severity") + "风险",
										" ·",
										response === void 0 ? "待应答" : stringProperty(response, "status")
									] })] })] }, requirement.id);
								})
							})]
						}), (0, react_jsx_runtime.jsxs)("article", {
							className: BidStudio_module_css_default.panel,
							children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: BidStudio_module_css_default.panelTitle,
									children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("h2", { children: "正式制品" }), (0, react_jsx_runtime.jsx)("p", { children: "只有人工审核通过后才能汇编导出。" })] }), (0, react_jsx_runtime.jsx)("div", {
										className: BidStudio_module_css_default.headerActions,
										children: (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: BidStudio_module_css_default.secondary,
											disabled: selectedArtifact === void 0,
											onClick: downloadArtifact,
											children: "下载"
										})
									})]
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: BidStudio_module_css_default.artifactTabs,
									children: artifacts.map((artifact) => (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										"data-active": artifact.id === selectedArtifact?.id || void 0,
										onClick: () => {
											setArtifactId(artifact.id);
										},
										children: stringProperty(artifact, "name")
									}, artifact.id))
								}),
								(0, react_jsx_runtime.jsx)("pre", {
									className: BidStudio_module_css_default.preview,
									children: selectedArtifact === void 0 ? "完成审核并点击“导出正式标书”，这里会显示汇编结果。" : stringProperty(selectedArtifact, "content")
								})
							]
						})]
					}),
					(0, react_jsx_runtime.jsx)(OntologyInspector, { definition })
				]
			});
		}
		function ofType(records, type) {
			return records[type] ?? [];
		}
		function forProject(records, type, projectId) {
			return projectId === void 0 ? [] : ofType(records, type).filter((record) => record.properties.projectId === projectId);
		}
		function stringProperty(object, key) {
			const value = object.properties[key];
			return typeof value === "string" ? value : "";
		}
		function numberProperty(object, key) {
			const value = object.properties[key];
			return typeof value === "number" ? value : 0;
		}
		function isOntologyObject(value) {
			return value !== null && typeof value === "object" && "id" in value && typeof value.id === "string" && "properties" in value;
		}
		function driverLabel(driver) {
			return {
				machine: "机器",
				workflow: "工作流",
				agent: "AI Agent",
				human: "人工"
			}[driver] ?? driver;
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Key shared by the navigation command and keyed application slot. */
		const BID_STUDIO_APPLICATION_ID = "bid-studio";
		/** Services required by the browser half. */
		const inject = [
			"slots",
			"layout",
			"remote",
			"remote.ontologyRemote"
		];
		/** Register the menu and page as independently disposable slot contributions. */
		function apply(ctx) {
			const remote = {
				async listObjects(type) {
					const result = await ctx.remote.ontologyRemote.listObjects(type);
					if (!result.ok) throw new Error(`${result.error.message} (${result.error.code})`);
					return result.value;
				},
				async execute(action, input) {
					const result = await ctx.remote.ontologyRemote.executeAction(action, input);
					if (!result.ok) throw new Error(`${result.error.message} (${result.error.code})`);
					return result.value;
				}
			};
			ctx.slots.inject("sidebar.application", () => ctx.slots.register({
				name: "sidebar.application",
				id: "bid-studio-navigation",
				order: 100,
				inject: () => ({
					applicationId: BID_STUDIO_APPLICATION_ID,
					open: () => {
						ctx.layout.openApplication(BID_STUDIO_APPLICATION_ID);
					},
					hooks: { layout: ctx.layout }
				})
			}, BidNavigation));
			ctx.slots.inject("application", () => ctx.slots.register({
				name: "application",
				key: BID_STUDIO_APPLICATION_ID,
				inject: () => ({
					definition: BID_ONTOLOGY,
					remote,
					close: () => {
						ctx.layout.closeApplication();
					}
				})
			}, BidStudio));
		}
		//#endregion
		exports.BID_STUDIO_APPLICATION_ID = BID_STUDIO_APPLICATION_ID;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map