/** Durable Bid Studio workbench for the complete standard response route. */
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {
  OntologyActionId,
  OntologyDefinition,
  OntologyObject,
  OntologyObjectTypeId,
  OntologyPropertyValue,
} from 'aiko-dsh-bid-studio/ontology/runtime'
import {
  APPROVE_BID_REVIEW,
  BID_OBJECT_TYPES,
  BID_WORKFLOW,
  CREATE_BID_PROJECT,
  EXPORT_BID_DOCUMENT,
  RUN_BID_TO_REVIEW,
} from '../definition.ts'
import css from './BidStudio.module.css'
import { OntologyInspector } from './OntologyInspector.tsx'

interface BidStudioRemote {
  listObjects(type?: OntologyObjectTypeId): Promise<readonly OntologyObject[]>
  execute(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<unknown>
}

type Props = PropsRuntime<'application'> & {
  definition: OntologyDefinition
  remote: BidStudioRemote
  close: () => void
}

const DEFAULT_TENDER = [
  '1. 投标人必须具备有效的 ISO 9001 质量管理体系认证，5分。',
  '2. 提供城市数据平台或数据治理同类项目案例，10分。',
  '3. 技术方案应覆盖数据采集、治理、共享交换和安全体系，20分。',
  '4. 项目必须在合同签订后 90 日内完成实施交付和验收，10分。',
  '5. 项目团队须包含项目经理、数据架构师和安全工程师，10分。',
  '6. 投标报价不得超过采购预算，商务报价得分15分。',
].join('\n')

/** Render the operational workbench and its secondary ontology inspector. */
export function BidStudio({ definition, remote, close }: Props) {
  const [records, setRecords] = useState<Readonly<Record<string, readonly OntologyObject[]>>>({})
  const [projectId, setProjectId] = useState<string>()
  const [artifactId, setArtifactId] = useState<string>()
  const [projectName, setProjectName] = useState('城市数据平台投标项目')
  const [tenderText, setTenderText] = useState(DEFAULT_TENDER)
  const [reviewer, setReviewer] = useState('项目负责人')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const refresh = useCallback(async () => {
    const entries = await Promise.all(
      Object.values(BID_OBJECT_TYPES).map(async type => [type, await remote.listObjects(type)] as const),
    )
    const next = Object.fromEntries(entries)
    setRecords(next)
    const projects = next[BID_OBJECT_TYPES.project] ?? []
    setProjectId(current => current ?? projects[0]?.id)
  }, [remote])

  useEffect(() => {
    let active = true
    void refresh().catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : String(reason))
    })
    return () => { active = false }
  }, [refresh])

  const projects = ofType(records, BID_OBJECT_TYPES.project)
  const selectedProject = projects.find(project => project.id === projectId)
  const requirements = forProject(records, BID_OBJECT_TYPES.requirement, projectId)
  const matches = forProject(records, BID_OBJECT_TYPES.evidenceMatch, projectId)
  const risks = forProject(records, BID_OBJECT_TYPES.risk, projectId)
  const responses = forProject(records, BID_OBJECT_TYPES.response, projectId)
  const reviews = forProject(records, BID_OBJECT_TYPES.review, projectId)
  const artifacts = forProject(records, BID_OBJECT_TYPES.artifact, projectId)
  const runs = forProject(records, BID_OBJECT_TYPES.workflowRun, projectId)
  const currentRun = runs[0]
  const steps = useMemo(() => ofType(records, BID_OBJECT_TYPES.workflowStep)
    .filter(step => step.properties.runId === currentRun?.id)
    .toSorted((left, right) => numberProperty(left, 'sequence') - numberProperty(right, 'sequence')), [currentRun?.id, records])
  const selectedReview = reviews[0]
  const selectedArtifact = artifacts.find(artifact => artifact.id === artifactId)
    ?? artifacts.find(artifact => stringProperty(artifact, 'status') === '正式版')
    ?? artifacts[artifacts.length - 1]

  async function runAction(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<unknown> {
    setBusy(true)
    setError(undefined)
    try {
      const result = await remote.execute(action, input)
      await refresh()
      return result
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
      return undefined
    } finally {
      setBusy(false)
    }
  }

  async function createProject(): Promise<void> {
    const created = await runAction(CREATE_BID_PROJECT, { name: projectName })
    if (isOntologyObject(created)) setProjectId(created.id)
  }

  async function runWorkflow(): Promise<void> {
    if (selectedProject === undefined) return
    await runAction(RUN_BID_TO_REVIEW, { projectId: selectedProject.id, tenderText })
  }

  async function approveReview(): Promise<void> {
    if (selectedProject === undefined) return
    await runAction(APPROVE_BID_REVIEW, { projectId: selectedProject.id, reviewer, comment: '已核对要求、证据引用、风险和应答内容，同意导出。' })
  }

  async function exportDocument(): Promise<void> {
    if (selectedProject === undefined) return
    const artifact = await runAction(EXPORT_BID_DOCUMENT, { projectId: selectedProject.id })
    if (isOntologyObject(artifact)) setArtifactId(artifact.id)
  }

  function downloadArtifact(): void {
    if (selectedArtifact === undefined) return
    const url = URL.createObjectURL(new Blob(
      [stringProperty(selectedArtifact, 'content')],
      { type: 'text/markdown;charset=utf-8' },
    ))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = stringProperty(selectedArtifact, 'name') || 'bid.md'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const reviewApproved = selectedReview !== undefined && stringProperty(selectedReview, 'status') === '已批准'

  return (
    <main className={css.page}>
      <header className={css.header}>
        <div>
          <div className={css.eyebrow}>LOCAL ONTOLOGY APPLICATION</div>
          <h1>投标工作台</h1>
          <p>标准流程把招标原文转成可追溯要求、证据、风险、应答、审核记录和正式制品。</p>
        </div>
        <button type="button" className={css.secondary} onClick={close}>返回对话</button>
      </header>

      {error !== undefined && <div className={css.error} role="alert">{error}</div>}

      <section className={css.metrics} aria-label="项目概览">
        <article><strong>{requirements.length}</strong><span>招标要求</span></article>
        <article><strong>{matches.length}</strong><span>证据匹配</span></article>
        <article><strong>{risks.filter(risk => risk.properties.resolved !== true).length}</strong><span>待闭环风险</span></article>
        <article>
          <strong>{responses.filter(response => response.properties.approved === true).length}/{responses.length}</strong>
          <span>已批准章节</span>
        </article>
      </section>

      <section className={css.workspace}>
        <aside className={css.projectPanel}>
          <div className={css.panelTitle}><div><h2>投标项目</h2><p>项目和流程记录持久化在本机。</p></div></div>
          <div className={css.createRow}>
            <input aria-label="项目名称" value={projectName} onChange={(event) => { setProjectName(event.target.value) }} />
            <button
              type="button"
              className={css.primary}
              disabled={busy || projectName.trim().length === 0}
              onClick={() => { void createProject() }}
            >新建</button>
          </div>
          <div className={css.projectList}>
            {projects.length === 0 && <p className={css.empty}>先新建项目，再输入招标原文运行完整流程。</p>}
            {projects.map(project => (
              <button
                type="button"
                key={project.id}
                data-active={project.id === projectId || undefined}
                onClick={() => { setProjectId(project.id); setArtifactId(undefined) }}
              >
                <span>{stringProperty(project, 'name')}</span>
                <small>{stringProperty(project, 'stage')}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className={css.executionPanel}>
          <div className={css.panelTitle}>
            <div><h2>招标原文与执行</h2><p>每行一个要求时，本地验证解析器可以给出最清晰的追溯结果。</p></div>
            <span className={css.badge}>{currentRun === undefined ? '尚未运行' : stringProperty(currentRun, 'status')}</span>
          </div>
          <textarea
            aria-label="招标原文"
            value={tenderText}
            onChange={(event) => { setTenderText(event.target.value) }}
            disabled={currentRun !== undefined}
          />
          <div className={css.actionBar}>
            <button
              type="button"
              className={css.primary}
              disabled={busy || selectedProject === undefined || currentRun !== undefined || tenderText.trim().length < 20}
              onClick={() => { void runWorkflow() }}
            >运行到人工审核</button>
            <input aria-label="审核人" value={reviewer} onChange={(event) => { setReviewer(event.target.value) }} />
            <button
              type="button"
              className={css.secondary}
              disabled={busy || selectedReview === undefined || reviewApproved || reviewer.trim().length === 0}
              onClick={() => { void approveReview() }}
            >审核通过</button>
            <button
              type="button"
              className={css.primary}
              disabled={busy || !reviewApproved}
              onClick={() => { void exportDocument() }}
            >导出正式标书</button>
          </div>
        </section>
      </section>

      <section className={css.panel}>
        <div className={css.panelTitle}>
          <div><h2>{BID_WORKFLOW.label}</h2><p>驱动者来自流程定义；Agent 节点当前使用可重复的本地验证适配器。</p></div>
          <span className={css.badge}>v{BID_WORKFLOW.version}</span>
        </div>
        <ol className={css.pipeline}>
          {BID_WORKFLOW.steps.map((definitionStep, index) => {
            const step = steps.find(candidate => candidate.properties.stepId === definitionStep.id)
            const status = step === undefined ? '待执行' : stringProperty(step, 'status')
            return (
              <li key={definitionStep.id} data-status={status}>
                <b>{index + 1}</b>
                <span><strong>{definitionStep.label}</strong><small>{driverLabel(definitionStep.driver)} · {status}</small></span>
              </li>
            )
          })}
        </ol>
      </section>

      <section className={css.traceGrid}>
        <article className={css.panel}>
          <div className={css.panelTitle}><div><h2>要求与应答追溯</h2><p>每条要求显示分类、分值、证据和风险状态。</p></div></div>
          <div className={css.traceList}>{requirements.length === 0
            ? <p className={css.empty}>流程运行后显示解析结果。</p>
            : requirements.map((requirement) => {
              const matchCount = matches.filter(match => match.properties.requirementId === requirement.id).length
              const risk = risks.find(candidate => candidate.properties.requirementId === requirement.id)
              const response = responses.find(candidate => candidate.properties.requirementId === requirement.id)
              return (
                <div key={requirement.id}>
                  <span className={css.category}>{stringProperty(requirement, 'category')}</span>
                  <div>
                    <strong>{stringProperty(requirement, 'title')}</strong>
                    <small>
                      {stringProperty(requirement, 'source')} ·
                      {typeof requirement.properties.score === 'number' ? ` ${requirement.properties.score} 分` : ' 无评分'} ·
                      证据 {matchCount} · {risk === undefined ? '无缺口' : stringProperty(risk, 'severity') + '风险'} ·
                      {response === undefined ? '待应答' : stringProperty(response, 'status')}
                    </small>
                  </div>
                </div>
              )
            })}</div>
        </article>

        <article className={css.panel}>
          <div className={css.panelTitle}>
            <div><h2>正式制品</h2><p>只有人工审核通过后才能汇编导出。</p></div>
            <div className={css.headerActions}>
              <button type="button" className={css.secondary} disabled={selectedArtifact === undefined} onClick={downloadArtifact}>下载</button>
            </div>
          </div>
          <div className={css.artifactTabs}>{artifacts.map(artifact => (
            <button
              type="button"
              key={artifact.id}
              data-active={artifact.id === selectedArtifact?.id || undefined}
              onClick={() => { setArtifactId(artifact.id) }}
            >{stringProperty(artifact, 'name')}</button>
          ))}</div>
          <pre className={css.preview}>
            {selectedArtifact === undefined
              ? '完成审核并点击“导出正式标书”，这里会显示汇编结果。'
              : stringProperty(selectedArtifact, 'content')}
          </pre>
        </article>
      </section>

      <OntologyInspector definition={definition} />
    </main>
  )
}

function ofType(
  records: Readonly<Record<string, readonly OntologyObject[]>>,
  type: OntologyObjectTypeId,
): readonly OntologyObject[] {
  return records[type] ?? []
}

function forProject(
  records: Readonly<Record<string, readonly OntologyObject[]>>,
  type: OntologyObjectTypeId,
  projectId: string | undefined,
): readonly OntologyObject[] {
  return projectId === undefined ? [] : ofType(records, type).filter(record => record.properties.projectId === projectId)
}

function stringProperty(object: OntologyObject, key: string): string {
  const value = object.properties[key]
  return typeof value === 'string' ? value : ''
}

function numberProperty(object: OntologyObject, key: string): number {
  const value = object.properties[key]
  return typeof value === 'number' ? value : 0
}

function isOntologyObject(value: unknown): value is OntologyObject {
  return value !== null && typeof value === 'object' && 'id' in value && typeof value.id === 'string' && 'properties' in value
}

function driverLabel(driver: string): string {
  return ({ machine: '机器', workflow: '工作流', agent: 'AI Agent', human: '人工' } as Record<string, string>)[driver] ?? driver
}
