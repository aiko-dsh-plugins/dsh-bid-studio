/** Local ontology Provider. @module aiko-dsh-bid-studio/ontology/local */
import { randomUUID } from 'node:crypto'
import { Service } from '@deepseek-ai/cordis'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import type {} from '@deepseek-ai/dsh-storage-domain'
import OntologyRuntime, {
  OntologyLinkId,
  OntologyObjectId,
  type CreateOntologyLinkRequest,
  type CreateOntologyObjectRequest,
  type OntologyActionContext,
  type OntologyActionHandler,
  type OntologyActionId,
  type OntologyDefinition,
  type OntologyFunctionDefinition,
  type OntologyFunctionHandler,
  type OntologyFunctionId,
  type OntologyFunctionValue,
  type OntologyImplementation,
  type OntologyLink,
  type OntologyLinkQuery,
  type OntologyLinkTypeDefinition,
  type OntologyObject,
  type OntologyObjectTypeDefinition,
  type OntologyObjectTypeId,
  type OntologyPropertyDefinition,
  type OntologyPropertyValue,
  type UpdateOntologyObjectRequest,
} from 'aiko-dsh-bid-studio/ontology/runtime'
import { ontologyDomainSpec } from './domain.ts'

const ID = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/
const PROPERTY_KEY = /^[a-z][A-Za-z0-9]*$/

interface RegisteredDefinition {
  readonly definition: OntologyDefinition
  readonly implementation: OntologyImplementation
}

/** In-process ontology runtime for a single desktop Harness host. */
export class LocalOntologyRuntime extends OntologyRuntime {
  static inject = ['storageDomain']

  private readonly definitionsById = new Map<string, RegisteredDefinition>()
  private readonly objectTypes = new Map<string, OntologyObjectTypeDefinition>()
  private readonly linkTypes = new Map<string, OntologyLinkTypeDefinition>()
  private readonly functions = new Map<string, { definition: OntologyFunctionDefinition; handler: OntologyFunctionHandler }>()
  private readonly actions = new Map<string, { definition: OntologyDefinition['actions'][number]; handler?: OntologyActionHandler }>()
  private readonly objects = new Map<string, OntologyObject>()
  private readonly links = new Map<string, OntologyLink>()
  private objectTable?: KvTable<OntologyObjectId, OntologyObject>
  private linkTable?: KvTable<OntologyLinkId, OntologyLink>

  /** Open durable storage and rebuild the immutable object cache before activation. */
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(ontologyDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'ontology-local.domainClose')
    this.objectTable = domain.table('objects')
    this.linkTable = domain.table('links')
    for (const [id, object] of this.objectTable.entries()) {
      this.objects.set(id, freezeObject(object))
    }
    for (const [id, link] of this.linkTable.entries()) this.links.set(id, Object.freeze({ ...link }))
  }

  /** Register and validate one hot-reloadable definition contribution. */
  register(definition: OntologyDefinition, implementation: OntologyImplementation = {}): () => void {
    validateDefinition(definition)
    if (this.definitionsById.has(definition.id)) {
      throw new Error(`ontology: definition '${definition.id}' is already registered`)
    }
    for (const objectType of definition.objectTypes) {
      if (this.objectTypes.has(objectType.id)) throw new Error(`ontology: object type '${objectType.id}' is already registered`)
    }
    for (const linkType of definition.linkTypes) {
      if (this.linkTypes.has(linkType.id)) throw new Error(`ontology: link type '${linkType.id}' is already registered`)
    }
    for (const functionDefinition of definition.functions) {
      if (this.functions.has(functionDefinition.id)) throw new Error(`ontology: function '${functionDefinition.id}' is already registered`)
      if (implementation.functions?.[functionDefinition.id] === undefined) {
        throw new Error(`ontology: function '${functionDefinition.id}' requires a handler`)
      }
    }
    for (const action of definition.actions) {
      if (this.actions.has(action.id)) throw new Error(`ontology: action '${action.id}' is already registered`)
      if (action.driver === 'machine' && implementation.actions?.[action.id] === undefined) {
        throw new Error(`ontology: machine action '${action.id}' requires a handler`)
      }
    }
    for (const objectType of definition.objectTypes) {
      for (const object of this.objects.values()) {
        if (object.type === objectType.id) validateProperties(objectType, object.properties)
      }
    }
    for (const linkType of definition.linkTypes) {
      for (const link of this.links.values()) {
        if (link.type === linkType.id) validateLink(linkType, link.from, link.to, this.objects, this.links, link.id)
      }
    }
    const registered: RegisteredDefinition = { definition: freezeDefinition(definition), implementation }
    this.definitionsById.set(definition.id, registered)
    for (const objectType of registered.definition.objectTypes) this.objectTypes.set(objectType.id, objectType)
    for (const linkType of registered.definition.linkTypes) this.linkTypes.set(linkType.id, linkType)
    for (const functionDefinition of registered.definition.functions) {
      const handler = implementation.functions?.[functionDefinition.id]
      if (handler === undefined) throw new Error(`ontology: function '${functionDefinition.id}' requires a handler`)
      this.functions.set(functionDefinition.id, { definition: functionDefinition, handler })
    }
    for (const action of registered.definition.actions) {
      const handler = implementation.actions?.[action.id]
      this.actions.set(action.id, { definition: action, ...(handler === undefined ? {} : { handler }) })
    }
    return () => {
      if (this.definitionsById.get(definition.id) !== registered) return
      this.definitionsById.delete(definition.id)
      for (const objectType of registered.definition.objectTypes) this.objectTypes.delete(objectType.id)
      for (const linkType of registered.definition.linkTypes) this.linkTypes.delete(linkType.id)
      for (const functionDefinition of registered.definition.functions) this.functions.delete(functionDefinition.id)
      for (const action of registered.definition.actions) this.actions.delete(action.id)
    }
  }

  /** Snapshot all active definitions in registration order. */
  definitions(): readonly OntologyDefinition[] {
    return Object.freeze([...this.definitionsById.values()].map(entry => entry.definition))
  }

  /** Create and validate one immutable in-memory object. */
  async createObject(request: CreateOntologyObjectRequest): Promise<OntologyObject> {
    return await this.createObjectNow(request)
  }

  /** Merge a validated property patch and persist the replacement snapshot. */
  async updateObject(request: UpdateOntologyObjectRequest): Promise<OntologyObject> {
    const current = this.objects.get(request.id)
    if (current === undefined) throw new Error(`ontology: unknown object '${request.id}'`)
    const type = this.objectTypes.get(current.type)
    if (type === undefined) throw new Error(`ontology: object type '${current.type}' is not active`)
    const properties = { ...current.properties, ...request.properties }
    validateProperties(type, properties)
    const value = freezeObject({ ...current, properties, updatedAt: Date.now() })
    await this.requireObjectTable().put(value.id, value)
    this.objects.set(value.id, value)
    return value
  }

  /** Validate and materialize an object inside the asynchronous service call. */
  private async createObjectNow(request: CreateOntologyObjectRequest): Promise<OntologyObject> {
    const type = this.objectTypes.get(request.type)
    if (type === undefined) throw new Error(`ontology: unknown object type '${request.type}'`)
    validateProperties(type, request.properties)
    const now = Date.now()
    const value = freezeObject({
      id: OntologyObjectId(randomUUID()),
      type: request.type,
      properties: request.properties,
      createdAt: now,
      updatedAt: now,
    })
    await this.requireObjectTable().put(value.id, value)
    this.objects.set(value.id, value)
    return value
  }

  /** List immutable object snapshots, optionally restricted to one type. */
  listObjects(type?: OntologyObjectTypeId): readonly OntologyObject[] {
    return Object.freeze([...this.objects.values()].filter(value => type === undefined || value.type === type))
  }

  /** Create and persist one validated graph edge. */
  async createLink(request: CreateOntologyLinkRequest): Promise<OntologyLink> {
    const type = this.linkTypes.get(request.type)
    if (type === undefined) throw new Error(`ontology: unknown link type '${request.type}'`)
    validateLink(type, request.from, request.to, this.objects, this.links)
    const value = Object.freeze({
      id: OntologyLinkId(randomUUID()),
      type: request.type,
      from: request.from,
      to: request.to,
      createdAt: Date.now(),
    })
    await this.requireLinkTable().put(value.id, value)
    this.links.set(value.id, value)
    return value
  }

  /** Delete one stored graph edge. */
  async deleteLink(id: OntologyLinkId): Promise<boolean> {
    const deleted = await this.requireLinkTable().delete(id)
    if (deleted) this.links.delete(id)
    return deleted
  }

  /** List immutable graph edges matching every supplied filter. */
  listLinks(query: OntologyLinkQuery = {}): readonly OntologyLink[] {
    return Object.freeze([...this.links.values()].filter(link =>
      (query.type === undefined || link.type === query.type)
      && (query.from === undefined || link.from === query.from)
      && (query.to === undefined || link.to === query.to)))
  }

  /** Execute one registered read-only Function and validate its result. */
  async executeFunction(
    functionId: OntologyFunctionId,
    input: Readonly<Record<string, OntologyPropertyValue>>,
  ): Promise<OntologyFunctionValue> {
    const registered = this.functions.get(functionId)
    if (registered === undefined) throw new Error(`ontology: unknown function '${functionId}'`)
    validateInputs('Function', functionId, registered.definition.inputs, input)
    const result = await registered.handler(Object.freeze({ ...input }), this.readContext())
    return normalizeFunctionResult(registered.definition, result, this.objects)
  }

  /** Execute one action through its declared provider route. */
  async executeAction(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<unknown> {
    const registered = this.actions.get(action)
    if (registered === undefined) throw new Error(`ontology: unknown action '${action}'`)
    const handler = registered.handler
    if (handler === undefined) throw new Error(`ontology: ${registered.definition.driver} action '${action}' has no configured adapter`)
    validateInputs('Action', action, registered.definition.inputs, input)
    const context: OntologyActionContext = {
      createObject: request => this.createObject(request),
      updateObject: request => this.updateObject(request),
      listObjects: type => this.listObjects(type),
      createLink: request => this.createLink(request),
      deleteLink: id => this.deleteLink(id),
      listLinks: query => this.listLinks(query),
      executeFunction: (functionId, functionInput) => this.executeFunction(functionId, functionInput),
    }
    const result = await handler(Object.freeze({ ...input }), context)
    if (registered.definition.result === undefined) return result
    return canonicalActionObject(registered.definition.id, result, registered.definition.result, this.objects)
  }

  private requireObjectTable(): KvTable<OntologyObjectId, OntologyObject> {
    if (this.objectTable === undefined) throw new Error('ontology: local storage is not ready')
    return this.objectTable
  }

  private requireLinkTable(): KvTable<OntologyLinkId, OntologyLink> {
    if (this.linkTable === undefined) throw new Error('ontology: local storage is not ready')
    return this.linkTable
  }

  private readContext() {
    return Object.freeze({
      listObjects: (type?: OntologyObjectTypeId) => this.listObjects(type),
      listLinks: (query?: OntologyLinkQuery) => this.listLinks(query),
    })
  }
}

/** Detach mutable aliases loaded from storage or supplied by callers. */
function freezeObject(value: OntologyObject): OntologyObject {
  return Object.freeze({
    ...value,
    properties: Object.freeze({ ...value.properties }),
  })
}

function validateDefinition(definition: OntologyDefinition): void {
  validateId('definition', definition.id)
  if (!Number.isSafeInteger(definition.version) || definition.version < 0) {
    throw new Error(`ontology: definition '${definition.id}' version must be a non-negative safe integer`)
  }
  const localTypes = new Set<string>()
  for (const objectType of definition.objectTypes) {
    validateId('object type', objectType.id)
    if (localTypes.has(objectType.id)) throw new Error(`ontology: duplicate object type '${objectType.id}'`)
    localTypes.add(objectType.id)
    const properties = new Set<string>()
    for (const property of objectType.properties) {
      if (!PROPERTY_KEY.test(property.key)) {
        throw new Error(`ontology: property key '${objectType.id}.${property.key}' must be lower camel case`)
      }
      if (properties.has(property.key)) throw new Error(`ontology: duplicate property '${objectType.id}.${property.key}'`)
      validateAllowedValues(`${objectType.id}.${property.key}`, property)
      properties.add(property.key)
    }
  }
  const localLinks = new Set<string>()
  for (const link of definition.linkTypes) {
    validateId('link type', link.id)
    if (localLinks.has(link.id)) throw new Error(`ontology: duplicate link type '${link.id}'`)
    localLinks.add(link.id)
    if (!localTypes.has(link.from) || !localTypes.has(link.to)) {
      throw new Error(`ontology: link '${link.id}' must reference object types from definition '${definition.id}'`)
    }
  }
  const localActions = new Set<string>()
  const localFunctions = new Set<string>()
  for (const functionDefinition of definition.functions) {
    validateId('function', functionDefinition.id)
    if (localFunctions.has(functionDefinition.id)) throw new Error(`ontology: duplicate function '${functionDefinition.id}'`)
    localFunctions.add(functionDefinition.id)
    validateInputDefinitions('Function', functionDefinition.id, functionDefinition.inputs)
    if ('objectType' in functionDefinition.result && !localTypes.has(functionDefinition.result.objectType)) {
      throw new Error(`ontology: function '${functionDefinition.id}' returns an object type outside definition '${definition.id}'`)
    }
  }
  for (const action of definition.actions) {
    validateId('action', action.id)
    if (localActions.has(action.id)) throw new Error(`ontology: duplicate action '${action.id}'`)
    localActions.add(action.id)
    if (action.target !== undefined && !localTypes.has(action.target)) {
      throw new Error(`ontology: action '${action.id}' targets an object type outside definition '${definition.id}'`)
    }
    if (action.result !== undefined && !localTypes.has(action.result)) {
      throw new Error(`ontology: action '${action.id}' returns an object type outside definition '${definition.id}'`)
    }
    validateInputDefinitions('Action', action.id, action.inputs)
  }
}

function validateInputs(
  kind: 'Action' | 'Function',
  id: string,
  definitions: readonly OntologyPropertyDefinition[] | undefined,
  values: Readonly<Record<string, unknown>>,
): void {
  validateInputDefinitions(kind, id, definitions)
  const inputs = new Map((definitions ?? []).map(input => [input.key, input]))
  for (const input of definitions ?? []) {
    const value = values[input.key]
    if (value === undefined) {
      if (input.required === true) throw new Error(`ontology: '${id}.${input.key}' is required`)
      continue
    }
    if (!matchesProperty(input, value)) throw new Error(`ontology: '${id}.${input.key}' must be ${input.type}`)
  }
  for (const key of Object.keys(values)) {
    if (!inputs.has(key)) throw new Error(`ontology: ${kind} '${id}' declares no input '${key}'`)
  }
}

function validateInputDefinitions(kind: 'Action' | 'Function', id: string, definitions: readonly OntologyPropertyDefinition[] | undefined): void {
  const inputs = new Set<string>()
  for (const input of definitions ?? []) {
    if (!PROPERTY_KEY.test(input.key)) throw new Error(`ontology: ${kind} input '${id}.${input.key}' must be lower camel case`)
    if (inputs.has(input.key)) throw new Error(`ontology: duplicate ${kind} input '${id}.${input.key}'`)
    validateAllowedValues(`${id}.${input.key}`, input)
    inputs.add(input.key)
  }
}

function validateLink(
  type: OntologyLinkTypeDefinition,
  fromId: OntologyObjectId,
  toId: OntologyObjectId,
  objects: ReadonlyMap<string, OntologyObject>,
  links: ReadonlyMap<string, OntologyLink>,
  self?: OntologyLinkId,
): void {
  const from = objects.get(fromId)
  const to = objects.get(toId)
  if (from === undefined) throw new Error(`ontology: link '${type.id}' has unknown from object '${fromId}'`)
  if (to === undefined) throw new Error(`ontology: link '${type.id}' has unknown to object '${toId}'`)
  if (from.type !== type.from) throw new Error(`ontology: link '${type.id}' from object must be '${type.from}'`)
  if (to.type !== type.to) throw new Error(`ontology: link '${type.id}' to object must be '${type.to}'`)
  for (const link of links.values()) {
    if (link.id === self || link.type !== type.id) continue
    if (link.from === fromId && link.to === toId) throw new Error(`ontology: link '${type.id}' already connects '${fromId}' to '${toId}'`)
    if (type.cardinality === 'one-to-one' && (link.from === fromId || link.to === toId)) {
      throw new Error(`ontology: link '${type.id}' violates one-to-one cardinality`)
    }
    if (type.cardinality === 'one-to-many' && link.to === toId) {
      throw new Error(`ontology: link '${type.id}' violates one-to-many cardinality`)
    }
  }
}

function normalizeFunctionResult(
  definition: OntologyFunctionDefinition,
  result: unknown,
  objects: ReadonlyMap<string, OntologyObject>,
): OntologyFunctionValue {
  switch (definition.result.kind) {
    case 'scalar':
      if (!matchesScalarType(definition.result.type, result)) throw new Error(`ontology: function '${definition.id}' result must be ${definition.result.type}`)
      return result as OntologyPropertyValue
    case 'object':
      return canonicalFunctionObject(definition, result, definition.result.objectType, objects)
    case 'object-list': {
      const objectType = definition.result.objectType
      if (!Array.isArray(result)) {
        throw new Error(`ontology: function '${definition.id}' result must be a list of '${objectType}' objects`)
      }
      return Object.freeze(result.map(value => canonicalFunctionObject(definition, value, objectType, objects)))
    }
  }
}

function canonicalFunctionObject(
  definition: OntologyFunctionDefinition,
  value: unknown,
  type: OntologyObjectTypeId,
  objects: ReadonlyMap<string, OntologyObject>,
): OntologyObject {
  if (typeof value !== 'object' || value === null || !('id' in value) || typeof value.id !== 'string') {
    throw new Error(`ontology: function '${definition.id}' result must be object type '${type}'`)
  }
  const stored = objects.get(value.id)
  if (stored === undefined || stored.type !== type) {
    throw new Error(`ontology: function '${definition.id}' result must reference a stored '${type}' object`)
  }
  return stored
}

function canonicalActionObject(
  actionId: OntologyActionId,
  value: unknown,
  type: OntologyObjectTypeId,
  objects: ReadonlyMap<string, OntologyObject>,
): OntologyObject {
  if (typeof value !== 'object' || value === null || !('id' in value) || typeof value.id !== 'string') {
    throw new Error(`ontology: action '${actionId}' result must be object type '${type}'`)
  }
  const stored = objects.get(value.id)
  if (stored === undefined || stored.type !== type) {
    throw new Error(`ontology: action '${actionId}' result must reference a stored '${type}' object`)
  }
  return stored
}

function validateId(subject: string, value: string): void {
  if (!ID.test(value)) throw new Error(`ontology: ${subject} id '${value}' must be namespaced lowercase text`)
}

function validateProperties(type: OntologyObjectTypeDefinition, values: Readonly<Record<string, unknown>>): void {
  const definitions = new Map(type.properties.map(property => [property.key, property]))
  for (const property of type.properties) {
    const value = values[property.key]
    if (value === undefined) {
      if (property.required === true) throw new Error(`ontology: '${type.id}.${property.key}' is required`)
      continue
    }
    if (!matchesProperty(property, value)) {
      throw new Error(`ontology: '${type.id}.${property.key}' must be ${property.type}`)
    }
  }
  for (const key of Object.keys(values)) {
    if (!definitions.has(key)) throw new Error(`ontology: '${type.id}' declares no property '${key}'`)
  }
}

function matchesProperty(property: OntologyPropertyDefinition, value: unknown): boolean {
  if (property.values !== undefined && !property.values.includes(value as OntologyPropertyValue)) return false
  switch (property.type) {
    case 'string': return typeof value === 'string'
    case 'number': return typeof value === 'number' && Number.isFinite(value)
    case 'boolean': return typeof value === 'boolean'
    case 'date': return typeof value === 'string' && !Number.isNaN(Date.parse(value))
  }
}

function validateAllowedValues(subject: string, property: OntologyPropertyDefinition): void {
  if (property.values === undefined) return
  if (property.values.length === 0) throw new Error(`ontology: '${subject}' values must not be empty`)
  for (const value of property.values) {
    if (!matchesScalarType(property.type, value)) throw new Error(`ontology: '${subject}' value must be ${property.type}`)
  }
}

function matchesScalarType(type: OntologyPropertyDefinition['type'], value: unknown): boolean {
  switch (type) {
    case 'string': return typeof value === 'string'
    case 'number': return typeof value === 'number' && Number.isFinite(value)
    case 'boolean': return typeof value === 'boolean'
    case 'date': return typeof value === 'string' && !Number.isNaN(Date.parse(value))
  }
}

function freezeDefinition(definition: OntologyDefinition): OntologyDefinition {
  return Object.freeze({
    id: definition.id,
    version: definition.version,
    objectTypes: Object.freeze(definition.objectTypes.map(type => Object.freeze({
      ...type,
      properties: Object.freeze(type.properties.map(property => Object.freeze({
        ...property,
        ...(property.values === undefined ? {} : { values: Object.freeze([...property.values]) }),
      }))),
    }))),
    linkTypes: Object.freeze(definition.linkTypes.map(link => Object.freeze({ ...link }))),
    functions: Object.freeze(definition.functions.map(functionDefinition => Object.freeze({
      ...functionDefinition,
      result: Object.freeze({ ...functionDefinition.result }),
      ...(functionDefinition.inputs === undefined ? {} : {
        inputs: Object.freeze(functionDefinition.inputs.map(input => Object.freeze({
          ...input,
          ...(input.values === undefined ? {} : { values: Object.freeze([...input.values]) }),
        }))),
      }),
    }))),
    actions: Object.freeze(definition.actions.map(action => Object.freeze({
      ...action,
      ...(action.inputs === undefined ? {} : {
        inputs: Object.freeze(action.inputs.map(input => Object.freeze({
          ...input,
          ...(input.values === undefined ? {} : { values: Object.freeze([...input.values]) }),
        }))),
      }),
    }))),
  })
}

export default LocalOntologyRuntime
