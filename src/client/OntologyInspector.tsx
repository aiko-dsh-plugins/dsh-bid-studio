/** Interactive view of every object, relationship, Function, Action, and process definition. */
import { useState } from 'react'
import type { OntologyDefinition, OntologyObjectTypeId, OntologyPropertyValue } from 'aiko-dsh-bid-studio/ontology/runtime'
import { BID_WORKFLOW } from '../definition.ts'
import css from './BidStudio.module.css'

type InspectorSection = 'objects' | 'links' | 'functions' | 'actions' | 'workflow'

interface OntologyInspectorProps {
  definition: OntologyDefinition
}

/** Render the complete installable definition instead of only its object properties. */
export function OntologyInspector({ definition }: OntologyInspectorProps) {
  const [section, setSection] = useState<InspectorSection>('objects')
  const [selectedTypeId, setSelectedTypeId] = useState(definition.objectTypes[0]?.id)
  const [selectedLinkId, setSelectedLinkId] = useState(definition.linkTypes[0]?.id)
  const [selectedFunctionId, setSelectedFunctionId] = useState(definition.functions[0]?.id)
  const [selectedActionId, setSelectedActionId] = useState(definition.actions[0]?.id)
  const [selectedStepId, setSelectedStepId] = useState(BID_WORKFLOW.steps[0]?.id)
  const selectedType = definition.objectTypes.find(type => type.id === selectedTypeId)
  const selectedLink = definition.linkTypes.find(link => link.id === selectedLinkId)
  const selectedFunction = definition.functions.find(functionDefinition => functionDefinition.id === selectedFunctionId)
  const selectedAction = definition.actions.find(action => action.id === selectedActionId)
  const selectedStep = BID_WORKFLOW.steps.find(step => step.id === selectedStepId)

  return (
    <details className={css.inspector} aria-label="标书本体定义">
      <summary>
        查看完整标书本体定义（{definition.objectTypes.length} 个对象类型、{definition.linkTypes.length} 个关系、
        {definition.functions.length} 个 Function、{definition.actions.length} 个 Action）
      </summary>
      <nav className={css.inspectorTabs} aria-label="本体定义视图">
        <InspectorTab active={section === 'objects'} onClick={() => { setSection('objects') }} label="对象类型" count={definition.objectTypes.length} />
        <InspectorTab active={section === 'links'} onClick={() => { setSection('links') }} label="关系定义" count={definition.linkTypes.length} />
        <InspectorTab active={section === 'functions'} onClick={() => { setSection('functions') }} label="Function 定义" count={definition.functions.length} />
        <InspectorTab active={section === 'actions'} onClick={() => { setSection('actions') }} label="Action 定义" count={definition.actions.length} />
        <InspectorTab active={section === 'workflow'} onClick={() => { setSection('workflow') }} label="运行流程" count={BID_WORKFLOW.steps.length} />
      </nav>

      {section === 'objects' && <div className={css.ontology}>
        <div className={css.typeList}>{definition.objectTypes.map(type => (
          <button
            type="button"
            key={type.id}
            data-active={selectedTypeId === type.id || undefined}
            onClick={() => { setSelectedTypeId(type.id) }}
          ><span>{type.label}</span><small>{type.id}</small></button>
        ))}</div>
        <div className={css.typeDetail}>{selectedType !== undefined && <>
          <DefinitionHeading title={selectedType.label} description={selectedType.description} id={selectedType.id} />
          <div className={css.propertyGrid}>{selectedType.properties.map(property => (
            <div key={property.key}>
              <code>{property.key}</code><span>{property.label}</span><small>{property.type}{property.required ? ' · 必填' : ''}{formatValues(property.values)}</small>
            </div>
          ))}</div>
        </>}</div>
      </div>}

      {section === 'functions' && <div className={css.ontology}>
        <div className={css.typeList}>{definition.functions.map(functionDefinition => (
          <button
            type="button"
            key={functionDefinition.id}
            data-active={selectedFunctionId === functionDefinition.id || undefined}
            onClick={() => { setSelectedFunctionId(functionDefinition.id) }}
          ><span>{functionDefinition.label}</span><small>{functionDefinition.id}</small></button>
        ))}</div>
        <div className={css.typeDetail}>{selectedFunction !== undefined && <>
          <DefinitionHeading title={selectedFunction.label} description={selectedFunction.description} id={selectedFunction.id} badge="只读计算" />
          <div className={css.definitionMeta}>
            <div><small>返回类型</small><strong>{functionResultLabel(selectedFunction.result, definition)}</strong></div>
          </div>
          <h3 className={css.definitionSubheading}>输入参数</h3>
          {selectedFunction.inputs === undefined || selectedFunction.inputs.length === 0
            ? <p className={css.empty}>无需输入参数。</p>
            : <div className={css.propertyGrid}>{selectedFunction.inputs.map(input => (
              <div key={input.key}>
                <code>{input.key}</code><span>{input.label}</span><small>{input.type}{input.required ? ' · 必填' : ''}{formatValues(input.values)}</small>
              </div>
            ))}</div>}
        </>}</div>
      </div>}

      {section === 'links' && <div className={css.ontology}>
        <div className={css.typeList}>{definition.linkTypes.map(link => (
          <button
            type="button"
            key={link.id}
            data-active={selectedLinkId === link.id || undefined}
            onClick={() => { setSelectedLinkId(link.id) }}
          ><span>{link.label}</span><small>{link.id}</small></button>
        ))}</div>
        <div className={css.typeDetail}>{selectedLink !== undefined && <>
          <DefinitionHeading title={selectedLink.label} description={selectedLink.description ?? '连接两个业务对象类型。'} id={selectedLink.id} />
          <div className={css.relationRoute}>
            <ObjectReference label="来源对象" typeId={selectedLink.from} definition={definition} />
            <span aria-hidden="true">→</span>
            <ObjectReference label="目标对象" typeId={selectedLink.to} definition={definition} />
          </div>
          <div className={css.definitionMeta}>
            <div><small>关系基数</small><strong>{cardinalityLabel(selectedLink.cardinality)}</strong></div>
            <div><small>方向</small><strong>从来源对象指向目标对象</strong></div>
          </div>
        </>}</div>
      </div>}

      {section === 'actions' && <div className={css.ontology}>
        <div className={css.typeList}>{definition.actions.map(action => (
          <button
            type="button"
            key={action.id}
            data-active={selectedActionId === action.id || undefined}
            onClick={() => { setSelectedActionId(action.id) }}
          ><span>{action.label}</span><small>{driverLabel(action.driver)} · {action.id}</small></button>
        ))}</div>
        <div className={css.typeDetail}>{selectedAction !== undefined && <>
          <DefinitionHeading title={selectedAction.label} description={selectedAction.description} id={selectedAction.id} badge={`${driverLabel(selectedAction.driver)}驱动`} />
          <div className={css.definitionMeta}>
            <DefinitionReference label="作用对象" typeId={selectedAction.target} definition={definition} />
            <DefinitionReference label="返回对象" typeId={selectedAction.result} definition={definition} />
          </div>
          <h3 className={css.definitionSubheading}>输入参数</h3>
          {selectedAction.inputs === undefined || selectedAction.inputs.length === 0
            ? <p className={css.empty}>无需输入参数。</p>
            : <div className={css.propertyGrid}>{selectedAction.inputs.map(input => (
              <div key={input.key}>
                <code>{input.key}</code><span>{input.label}</span><small>{input.type}{input.required ? ' · 必填' : ''}{formatValues(input.values)}</small>
              </div>
            ))}</div>}
        </>}</div>
      </div>}

      {section === 'workflow' && <div className={css.ontology}>
        <div className={css.typeList}>{BID_WORKFLOW.steps.map((step, index) => (
          <button
            type="button"
            key={step.id}
            data-active={selectedStepId === step.id || undefined}
            onClick={() => { setSelectedStepId(step.id) }}
          ><span>{index + 1}. {step.label}</span><small>{driverLabel(step.driver)} · {step.action}</small></button>
        ))}</div>
        <div className={css.typeDetail}>{selectedStep !== undefined && <>
          <DefinitionHeading
            title={BID_WORKFLOW.label}
            description={`步骤 ${BID_WORKFLOW.steps.findIndex(step => step.id === selectedStep.id) + 1}：${selectedStep.description}`}
            id={`${BID_WORKFLOW.id}@${BID_WORKFLOW.version}`}
            badge={driverLabel(selectedStep.driver)}
          />
          <div className={css.definitionMeta}>
            <div><small>流程步骤</small><strong>{selectedStep.label}</strong><code>{selectedStep.id}</code></div>
            <div>
              <small>执行 Action</small>
              <strong>{definition.actions.find(action => action.id === selectedStep.action)?.label ?? selectedStep.action}</strong>
              <code>{selectedStep.action}</code>
            </div>
          </div>
          <h3 className={css.definitionSubheading}>产出对象</h3>
          <div className={css.outputList}>{selectedStep.produces.map(typeId => (
            <ObjectReference key={typeId} label="产出" typeId={typeId} definition={definition} />
          ))}</div>
        </>}</div>
      </div>}
    </details>
  )
}

function InspectorTab(
  { active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number },
) {
  return <button type="button" data-active={active || undefined} onClick={onClick}>{label} <span>{count}</span></button>
}

function DefinitionHeading(
  { title, description, id, badge }: { title: string; description: string; id: string; badge?: string },
) {
  return <div className={css.panelTitle}>
    <div><h2>{title}</h2><p>{description}</p><code className={css.definitionId}>{id}</code></div>
    {badge !== undefined && <span className={css.badge}>{badge}</span>}
  </div>
}

function ObjectReference(
  { label, typeId, definition }: { label: string; typeId: OntologyObjectTypeId; definition: OntologyDefinition },
) {
  const type = definition.objectTypes.find(candidate => candidate.id === typeId)
  return <div><small>{label}</small><strong>{type?.label ?? typeId}</strong><code>{typeId}</code></div>
}

function DefinitionReference(
  { label, typeId, definition }: {
    label: string
    typeId: OntologyObjectTypeId | undefined
    definition: OntologyDefinition
  },
) {
  if (typeId === undefined) return <div><small>{label}</small><strong>无</strong></div>
  return <ObjectReference label={label} typeId={typeId} definition={definition} />
}

function formatValues(values: readonly OntologyPropertyValue[] | undefined): string {
  return values === undefined ? '' : ` · ${values.join(' / ')}`
}

function cardinalityLabel(cardinality: 'one-to-one' | 'one-to-many' | 'many-to-many' | undefined): string {
  return ({ 'one-to-one': '一对一', 'one-to-many': '一对多', 'many-to-many': '多对多' } as const)[cardinality ?? 'one-to-many']
}

function functionResultLabel(
  result: OntologyDefinition['functions'][number]['result'],
  definition: OntologyDefinition,
): string {
  if (result.kind === 'scalar') return result.type
  const objectType = definition.objectTypes.find(type => type.id === result.objectType)
  return `${objectType?.label ?? result.objectType}${result.kind === 'object-list' ? '列表' : ''}`
}

function driverLabel(driver: string): string {
  return ({ machine: '机器', workflow: '工作流', agent: 'AI Agent', human: '人工' } as Record<string, string>)[driver] ?? driver
}
