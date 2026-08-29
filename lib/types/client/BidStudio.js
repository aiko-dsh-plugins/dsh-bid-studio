import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Durable Bid Studio workbench for the complete standard response route. */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { APPROVE_BID_REVIEW, BID_OBJECT_TYPES, BID_WORKFLOW, CREATE_BID_PROJECT, EXPORT_BID_DOCUMENT, RUN_BID_TO_REVIEW, } from "../definition.js";
import css from './BidStudio.module.css';
import { OntologyInspector } from "./OntologyInspector.js";
const DEFAULT_TENDER = [
    '1. 投标人必须具备有效的 ISO 9001 质量管理体系认证，5分。',
    '2. 提供城市数据平台或数据治理同类项目案例，10分。',
    '3. 技术方案应覆盖数据采集、治理、共享交换和安全体系，20分。',
    '4. 项目必须在合同签订后 90 日内完成实施交付和验收，10分。',
    '5. 项目团队须包含项目经理、数据架构师和安全工程师，10分。',
    '6. 投标报价不得超过采购预算，商务报价得分15分。',
].join('\n');
/** Render the operational workbench and its secondary ontology inspector. */
export function BidStudio({ definition, remote, close }) {
    const [records, setRecords] = useState({});
    const [projectId, setProjectId] = useState();
    const [artifactId, setArtifactId] = useState();
    const [projectName, setProjectName] = useState('城市数据平台投标项目');
    const [tenderText, setTenderText] = useState(DEFAULT_TENDER);
    const [reviewer, setReviewer] = useState('项目负责人');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState();
    const refresh = useCallback(async () => {
        const entries = await Promise.all(Object.values(BID_OBJECT_TYPES).map(async (type) => [type, await remote.listObjects(type)]));
        const next = Object.fromEntries(entries);
        setRecords(next);
        const projects = next[BID_OBJECT_TYPES.project] ?? [];
        setProjectId(current => current ?? projects[0]?.id);
    }, [remote]);
    useEffect(() => {
        let active = true;
        void refresh().catch((reason) => {
            if (active)
                setError(reason instanceof Error ? reason.message : String(reason));
        });
        return () => { active = false; };
    }, [refresh]);
    const projects = ofType(records, BID_OBJECT_TYPES.project);
    const selectedProject = projects.find(project => project.id === projectId);
    const requirements = forProject(records, BID_OBJECT_TYPES.requirement, projectId);
    const matches = forProject(records, BID_OBJECT_TYPES.evidenceMatch, projectId);
    const risks = forProject(records, BID_OBJECT_TYPES.risk, projectId);
    const responses = forProject(records, BID_OBJECT_TYPES.response, projectId);
    const reviews = forProject(records, BID_OBJECT_TYPES.review, projectId);
    const artifacts = forProject(records, BID_OBJECT_TYPES.artifact, projectId);
    const runs = forProject(records, BID_OBJECT_TYPES.workflowRun, projectId);
    const currentRun = runs[0];
    const steps = useMemo(() => ofType(records, BID_OBJECT_TYPES.workflowStep)
        .filter(step => step.properties.runId === currentRun?.id)
        .toSorted((left, right) => numberProperty(left, 'sequence') - numberProperty(right, 'sequence')), [currentRun?.id, records]);
    const selectedReview = reviews[0];
    const selectedArtifact = artifacts.find(artifact => artifact.id === artifactId)
        ?? artifacts.find(artifact => stringProperty(artifact, 'status') === '正式版')
        ?? artifacts[artifacts.length - 1];
    async function runAction(action, input) {
        setBusy(true);
        setError(undefined);
        try {
            const result = await remote.execute(action, input);
            await refresh();
            return result;
        }
        catch (reason) {
            setError(reason instanceof Error ? reason.message : String(reason));
            return undefined;
        }
        finally {
            setBusy(false);
        }
    }
    async function createProject() {
        const created = await runAction(CREATE_BID_PROJECT, { name: projectName });
        if (isOntologyObject(created))
            setProjectId(created.id);
    }
    async function runWorkflow() {
        if (selectedProject === undefined)
            return;
        await runAction(RUN_BID_TO_REVIEW, { projectId: selectedProject.id, tenderText });
    }
    async function approveReview() {
        if (selectedProject === undefined)
            return;
        await runAction(APPROVE_BID_REVIEW, { projectId: selectedProject.id, reviewer, comment: '已核对要求、证据引用、风险和应答内容，同意导出。' });
    }
    async function exportDocument() {
        if (selectedProject === undefined)
            return;
        const artifact = await runAction(EXPORT_BID_DOCUMENT, { projectId: selectedProject.id });
        if (isOntologyObject(artifact))
            setArtifactId(artifact.id);
    }
    function downloadArtifact() {
        if (selectedArtifact === undefined)
            return;
        const url = URL.createObjectURL(new Blob([stringProperty(selectedArtifact, 'content')], { type: 'text/markdown;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = stringProperty(selectedArtifact, 'name') || 'bid.md';
        anchor.click();
        URL.revokeObjectURL(url);
    }
    const reviewApproved = selectedReview !== undefined && stringProperty(selectedReview, 'status') === '已批准';
    return (_jsxs("main", { className: css.page, children: [_jsxs("header", { className: css.header, children: [_jsxs("div", { children: [_jsx("div", { className: css.eyebrow, children: "LOCAL ONTOLOGY APPLICATION" }), _jsx("h1", { children: "\u6295\u6807\u5DE5\u4F5C\u53F0" }), _jsx("p", { children: "\u6807\u51C6\u6D41\u7A0B\u628A\u62DB\u6807\u539F\u6587\u8F6C\u6210\u53EF\u8FFD\u6EAF\u8981\u6C42\u3001\u8BC1\u636E\u3001\u98CE\u9669\u3001\u5E94\u7B54\u3001\u5BA1\u6838\u8BB0\u5F55\u548C\u6B63\u5F0F\u5236\u54C1\u3002" })] }), _jsx("button", { type: "button", className: css.secondary, onClick: close, children: "\u8FD4\u56DE\u5BF9\u8BDD" })] }), error !== undefined && _jsx("div", { className: css.error, role: "alert", children: error }), _jsxs("section", { className: css.metrics, "aria-label": "\u9879\u76EE\u6982\u89C8", children: [_jsxs("article", { children: [_jsx("strong", { children: requirements.length }), _jsx("span", { children: "\u62DB\u6807\u8981\u6C42" })] }), _jsxs("article", { children: [_jsx("strong", { children: matches.length }), _jsx("span", { children: "\u8BC1\u636E\u5339\u914D" })] }), _jsxs("article", { children: [_jsx("strong", { children: risks.filter(risk => risk.properties.resolved !== true).length }), _jsx("span", { children: "\u5F85\u95ED\u73AF\u98CE\u9669" })] }), _jsxs("article", { children: [_jsxs("strong", { children: [responses.filter(response => response.properties.approved === true).length, "/", responses.length] }), _jsx("span", { children: "\u5DF2\u6279\u51C6\u7AE0\u8282" })] })] }), _jsxs("section", { className: css.workspace, children: [_jsxs("aside", { className: css.projectPanel, children: [_jsx("div", { className: css.panelTitle, children: _jsxs("div", { children: [_jsx("h2", { children: "\u6295\u6807\u9879\u76EE" }), _jsx("p", { children: "\u9879\u76EE\u548C\u6D41\u7A0B\u8BB0\u5F55\u6301\u4E45\u5316\u5728\u672C\u673A\u3002" })] }) }), _jsxs("div", { className: css.createRow, children: [_jsx("input", { "aria-label": "\u9879\u76EE\u540D\u79F0", value: projectName, onChange: (event) => { setProjectName(event.target.value); } }), _jsx("button", { type: "button", className: css.primary, disabled: busy || projectName.trim().length === 0, onClick: () => { void createProject(); }, children: "\u65B0\u5EFA" })] }), _jsxs("div", { className: css.projectList, children: [projects.length === 0 && _jsx("p", { className: css.empty, children: "\u5148\u65B0\u5EFA\u9879\u76EE\uFF0C\u518D\u8F93\u5165\u62DB\u6807\u539F\u6587\u8FD0\u884C\u5B8C\u6574\u6D41\u7A0B\u3002" }), projects.map(project => (_jsxs("button", { type: "button", "data-active": project.id === projectId || undefined, onClick: () => { setProjectId(project.id); setArtifactId(undefined); }, children: [_jsx("span", { children: stringProperty(project, 'name') }), _jsx("small", { children: stringProperty(project, 'stage') })] }, project.id)))] })] }), _jsxs("section", { className: css.executionPanel, children: [_jsxs("div", { className: css.panelTitle, children: [_jsxs("div", { children: [_jsx("h2", { children: "\u62DB\u6807\u539F\u6587\u4E0E\u6267\u884C" }), _jsx("p", { children: "\u6BCF\u884C\u4E00\u4E2A\u8981\u6C42\u65F6\uFF0C\u672C\u5730\u9A8C\u8BC1\u89E3\u6790\u5668\u53EF\u4EE5\u7ED9\u51FA\u6700\u6E05\u6670\u7684\u8FFD\u6EAF\u7ED3\u679C\u3002" })] }), _jsx("span", { className: css.badge, children: currentRun === undefined ? '尚未运行' : stringProperty(currentRun, 'status') })] }), _jsx("textarea", { "aria-label": "\u62DB\u6807\u539F\u6587", value: tenderText, onChange: (event) => { setTenderText(event.target.value); }, disabled: currentRun !== undefined }), _jsxs("div", { className: css.actionBar, children: [_jsx("button", { type: "button", className: css.primary, disabled: busy || selectedProject === undefined || currentRun !== undefined || tenderText.trim().length < 20, onClick: () => { void runWorkflow(); }, children: "\u8FD0\u884C\u5230\u4EBA\u5DE5\u5BA1\u6838" }), _jsx("input", { "aria-label": "\u5BA1\u6838\u4EBA", value: reviewer, onChange: (event) => { setReviewer(event.target.value); } }), _jsx("button", { type: "button", className: css.secondary, disabled: busy || selectedReview === undefined || reviewApproved || reviewer.trim().length === 0, onClick: () => { void approveReview(); }, children: "\u5BA1\u6838\u901A\u8FC7" }), _jsx("button", { type: "button", className: css.primary, disabled: busy || !reviewApproved, onClick: () => { void exportDocument(); }, children: "\u5BFC\u51FA\u6B63\u5F0F\u6807\u4E66" })] })] })] }), _jsxs("section", { className: css.panel, children: [_jsxs("div", { className: css.panelTitle, children: [_jsxs("div", { children: [_jsx("h2", { children: BID_WORKFLOW.label }), _jsx("p", { children: "\u9A71\u52A8\u8005\u6765\u81EA\u6D41\u7A0B\u5B9A\u4E49\uFF1BAgent \u8282\u70B9\u5F53\u524D\u4F7F\u7528\u53EF\u91CD\u590D\u7684\u672C\u5730\u9A8C\u8BC1\u9002\u914D\u5668\u3002" })] }), _jsxs("span", { className: css.badge, children: ["v", BID_WORKFLOW.version] })] }), _jsx("ol", { className: css.pipeline, children: BID_WORKFLOW.steps.map((definitionStep, index) => {
                            const step = steps.find(candidate => candidate.properties.stepId === definitionStep.id);
                            const status = step === undefined ? '待执行' : stringProperty(step, 'status');
                            return (_jsxs("li", { "data-status": status, children: [_jsx("b", { children: index + 1 }), _jsxs("span", { children: [_jsx("strong", { children: definitionStep.label }), _jsxs("small", { children: [driverLabel(definitionStep.driver), " \u00B7 ", status] })] })] }, definitionStep.id));
                        }) })] }), _jsxs("section", { className: css.traceGrid, children: [_jsxs("article", { className: css.panel, children: [_jsx("div", { className: css.panelTitle, children: _jsxs("div", { children: [_jsx("h2", { children: "\u8981\u6C42\u4E0E\u5E94\u7B54\u8FFD\u6EAF" }), _jsx("p", { children: "\u6BCF\u6761\u8981\u6C42\u663E\u793A\u5206\u7C7B\u3001\u5206\u503C\u3001\u8BC1\u636E\u548C\u98CE\u9669\u72B6\u6001\u3002" })] }) }), _jsx("div", { className: css.traceList, children: requirements.length === 0
                                    ? _jsx("p", { className: css.empty, children: "\u6D41\u7A0B\u8FD0\u884C\u540E\u663E\u793A\u89E3\u6790\u7ED3\u679C\u3002" })
                                    : requirements.map((requirement) => {
                                        const matchCount = matches.filter(match => match.properties.requirementId === requirement.id).length;
                                        const risk = risks.find(candidate => candidate.properties.requirementId === requirement.id);
                                        const response = responses.find(candidate => candidate.properties.requirementId === requirement.id);
                                        return (_jsxs("div", { children: [_jsx("span", { className: css.category, children: stringProperty(requirement, 'category') }), _jsxs("div", { children: [_jsx("strong", { children: stringProperty(requirement, 'title') }), _jsxs("small", { children: [stringProperty(requirement, 'source'), " \u00B7", typeof requirement.properties.score === 'number' ? ` ${requirement.properties.score} 分` : ' 无评分', " \u00B7 \u8BC1\u636E ", matchCount, " \u00B7 ", risk === undefined ? '无缺口' : stringProperty(risk, 'severity') + '风险', " \u00B7", response === undefined ? '待应答' : stringProperty(response, 'status')] })] })] }, requirement.id));
                                    }) })] }), _jsxs("article", { className: css.panel, children: [_jsxs("div", { className: css.panelTitle, children: [_jsxs("div", { children: [_jsx("h2", { children: "\u6B63\u5F0F\u5236\u54C1" }), _jsx("p", { children: "\u53EA\u6709\u4EBA\u5DE5\u5BA1\u6838\u901A\u8FC7\u540E\u624D\u80FD\u6C47\u7F16\u5BFC\u51FA\u3002" })] }), _jsx("div", { className: css.headerActions, children: _jsx("button", { type: "button", className: css.secondary, disabled: selectedArtifact === undefined, onClick: downloadArtifact, children: "\u4E0B\u8F7D" }) })] }), _jsx("div", { className: css.artifactTabs, children: artifacts.map(artifact => (_jsx("button", { type: "button", "data-active": artifact.id === selectedArtifact?.id || undefined, onClick: () => { setArtifactId(artifact.id); }, children: stringProperty(artifact, 'name') }, artifact.id))) }), _jsx("pre", { className: css.preview, children: selectedArtifact === undefined
                                    ? '完成审核并点击“导出正式标书”，这里会显示汇编结果。'
                                    : stringProperty(selectedArtifact, 'content') })] })] }), _jsx(OntologyInspector, { definition: definition })] }));
}
function ofType(records, type) {
    return records[type] ?? [];
}
function forProject(records, type, projectId) {
    return projectId === undefined ? [] : ofType(records, type).filter(record => record.properties.projectId === projectId);
}
function stringProperty(object, key) {
    const value = object.properties[key];
    return typeof value === 'string' ? value : '';
}
function numberProperty(object, key) {
    const value = object.properties[key];
    return typeof value === 'number' ? value : 0;
}
function isOntologyObject(value) {
    return value !== null && typeof value === 'object' && 'id' in value && typeof value.id === 'string' && 'properties' in value;
}
function driverLabel(driver) {
    return { machine: '机器', workflow: '工作流', agent: 'AI Agent', human: '人工' }[driver] ?? driver;
}
//# sourceMappingURL=BidStudio.js.map