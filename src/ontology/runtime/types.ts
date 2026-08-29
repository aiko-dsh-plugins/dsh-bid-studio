/** Pure ontology definition and runtime vocabulary. @module aiko-dsh-bid-studio/ontology/types */
import type { Branded } from '@deepseek-ai/dsh-brand'

/** Stable identifier of an ontology package contribution. */
export type OntologyDefinitionId = Branded<'OntologyDefinitionId'>
/** Stable identifier of an ontology object type. */
export type OntologyObjectTypeId = Branded<'OntologyObjectTypeId'>
/** Stable identifier of an ontology link type. */
export type OntologyLinkTypeId = Branded<'OntologyLinkTypeId'>
/** Stable identifier of an ontology Function. */
export type OntologyFunctionId = Branded<'OntologyFunctionId'>
/** Stable identifier of an ontology Action. */
export type OntologyActionId = Branded<'OntologyActionId'>
/** Opaque identifier of one runtime object. */
export type OntologyObjectId = Branded<'OntologyObjectId'>
/** Opaque identifier of one runtime link. */
export type OntologyLinkId = Branded<'OntologyLinkId'>

/**
 * Construct a definition id from a trusted package-owned literal.
 * @param value - Namespaced id.
 * @returns Branded id.
 */
export const OntologyDefinitionId = (value: string): OntologyDefinitionId => value as OntologyDefinitionId
/**
 * Construct an object-type id from a trusted package-owned literal.
 * @param value - Namespaced id.
 * @returns Branded id.
 */
export const OntologyObjectTypeId = (value: string): OntologyObjectTypeId => value as OntologyObjectTypeId
/**
 * Construct a link-type id from a trusted package-owned literal.
 * @param value - Namespaced id.
 * @returns Branded id.
 */
export const OntologyLinkTypeId = (value: string): OntologyLinkTypeId => value as OntologyLinkTypeId
/**
 * Construct a Function id from a trusted package-owned literal.
 * @param value - Namespaced id.
 * @returns Branded id.
 */
export const OntologyFunctionId = (value: string): OntologyFunctionId => value as OntologyFunctionId
/**
 * Construct an Action id from a trusted package-owned literal.
 * @param value - Namespaced id.
 * @returns Branded id.
 */
export const OntologyActionId = (value: string): OntologyActionId => value as OntologyActionId
/**
 * Construct an object id from a trusted runtime value.
 * @param value - Provider id.
 * @returns Branded id.
 */
export const OntologyObjectId = (value: string): OntologyObjectId => value as OntologyObjectId
/**
 * Construct a link id from a trusted runtime value.
 * @param value - Provider id.
 * @returns Branded id.
 */
export const OntologyLinkId = (value: string): OntologyLinkId => value as OntologyLinkId

/** Scalar property types understood by every ontology provider. */
export type OntologyScalarType = 'string' | 'number' | 'boolean' | 'date'
/** JSON scalar stored in an ontology object's declared properties. */
export type OntologyPropertyValue = string | number | boolean

/** One declared property on an object type. */
export interface OntologyPropertyDefinition {
  readonly key: string
  readonly label: string
  readonly type: OntologyScalarType
  readonly required?: boolean
  /** Optional closed set accepted by every Provider. */
  readonly values?: readonly OntologyPropertyValue[]
}

/** One business object type. */
export interface OntologyObjectTypeDefinition {
  readonly id: OntologyObjectTypeId
  readonly label: string
  readonly description: string
  readonly properties: readonly OntologyPropertyDefinition[]
}

/** A directional relationship between object types. */
export interface OntologyLinkTypeDefinition {
  readonly id: OntologyLinkTypeId
  readonly label: string
  readonly from: OntologyObjectTypeId
  readonly to: OntologyObjectTypeId
  readonly cardinality?: 'one-to-one' | 'one-to-many' | 'many-to-many'
  readonly description?: string
}

/** The declared result category of an ontology Function. */
export type OntologyFunctionResultDefinition =
  | { readonly kind: 'scalar'; readonly type: OntologyScalarType }
  | { readonly kind: 'object'; readonly objectType: OntologyObjectTypeId }
  | { readonly kind: 'object-list'; readonly objectType: OntologyObjectTypeId }

/** Reusable business computation over ontology state. */
export interface OntologyFunctionDefinition {
  readonly id: OntologyFunctionId
  readonly label: string
  readonly description: string
  readonly inputs?: readonly OntologyPropertyDefinition[]
  readonly result: OntologyFunctionResultDefinition
}

/** Who supplies the work behind an ontology Action. */
export type OntologyActionDriver = 'machine' | 'workflow' | 'agent' | 'human'

/** User- or agent-invocable operation attached to the ontology. */
export interface OntologyActionDefinition {
  readonly id: OntologyActionId
  readonly label: string
  readonly target?: OntologyObjectTypeId
  readonly driver: OntologyActionDriver
  readonly description: string
  readonly inputs?: readonly OntologyPropertyDefinition[]
  readonly result?: OntologyObjectTypeId
}

/** One installable ontology definition contribution. */
export interface OntologyDefinition {
  readonly id: OntologyDefinitionId
  readonly version: number
  readonly objectTypes: readonly OntologyObjectTypeDefinition[]
  readonly linkTypes: readonly OntologyLinkTypeDefinition[]
  readonly functions: readonly OntologyFunctionDefinition[]
  readonly actions: readonly OntologyActionDefinition[]
}

/** Immutable stored ontology object. */
export interface OntologyObject {
  readonly id: OntologyObjectId
  readonly type: OntologyObjectTypeId
  readonly properties: Readonly<Record<string, OntologyPropertyValue>>
  readonly createdAt: number
  readonly updatedAt: number
}

/** Validated runtime value returned by an ontology Function. */
export type OntologyFunctionValue = OntologyPropertyValue | OntologyObject | readonly OntologyObject[]

/** Immutable stored relationship between two ontology objects. */
export interface OntologyLink {
  readonly id: OntologyLinkId
  readonly type: OntologyLinkTypeId
  readonly from: OntologyObjectId
  readonly to: OntologyObjectId
  readonly createdAt: number
}

/** Request to create one ontology object. */
export interface CreateOntologyObjectRequest {
  readonly type: OntologyObjectTypeId
  readonly properties: Readonly<Record<string, OntologyPropertyValue>>
}

/** Request to merge declared properties into one stored object. */
export interface UpdateOntologyObjectRequest {
  readonly id: OntologyObjectId
  readonly properties: Readonly<Record<string, OntologyPropertyValue>>
}

/** Request to create a validated relationship between two objects. */
export interface CreateOntologyLinkRequest {
  readonly type: OntologyLinkTypeId
  readonly from: OntologyObjectId
  readonly to: OntologyObjectId
}

/** Optional filters applied together when listing links. */
export interface OntologyLinkQuery {
  readonly type?: OntologyLinkTypeId
  readonly from?: OntologyObjectId
  readonly to?: OntologyObjectId
}

/** Read-only state available to ontology Functions and Actions. */
export interface OntologyReadContext {
  /**
   * List current objects.
   * @param type - Optional type filter.
   * @returns Matching objects.
   */
  listObjects(type?: OntologyObjectTypeId): readonly OntologyObject[]
  /**
   * List current links.
   * @param query - Optional endpoint and type filters.
   * @returns Matching links.
   */
  listLinks(query?: OntologyLinkQuery): readonly OntologyLink[]
}

/** Context available to a package-owned Action implementation. */
export interface OntologyActionContext extends OntologyReadContext {
  /**
   * Create an object through the active Provider.
   * @param request - Validated creation request.
   * @returns Stored object.
   */
  createObject(request: CreateOntologyObjectRequest): Promise<OntologyObject>
  /**
   * Merge properties into an existing object through the active Provider.
   * @param request - Object id and declared property patch.
   * @returns Updated immutable object.
   */
  updateObject(request: UpdateOntologyObjectRequest): Promise<OntologyObject>
  /**
   * Create a relationship through the active Provider.
   * @param request - Link type and endpoints.
   * @returns Stored link.
   */
  createLink(request: CreateOntologyLinkRequest): Promise<OntologyLink>
  /**
   * Delete a relationship through the active Provider.
   * @param id - Stored link id.
   * @returns Whether the link existed.
   */
  deleteLink(id: OntologyLinkId): Promise<boolean>
  /**
   * Execute a registered read-only Function.
   * @param functionId - Function id.
   * @param input - Function fields.
   * @returns Validated Function result.
   */
  executeFunction(functionId: OntologyFunctionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<OntologyFunctionValue>
}

/** Executable adapter contributed for one Action descriptor. */
export type OntologyActionHandler = (
  input: Readonly<Record<string, OntologyPropertyValue>>,
  context: OntologyActionContext,
) => Promise<unknown>

/** Optional executable handlers paired with one definition contribution. */
export type OntologyActionHandlers = Readonly<Partial<Record<OntologyActionId, OntologyActionHandler>>>

/** Executable adapter contributed for one Function descriptor. */
export type OntologyFunctionHandler = (
  input: Readonly<Record<string, OntologyPropertyValue>>,
  context: OntologyReadContext,
) => Promise<unknown>

/** Function adapters paired with one definition contribution. */
export type OntologyFunctionHandlers = Readonly<Partial<Record<OntologyFunctionId, OntologyFunctionHandler>>>

/** Executable implementation paired with one ontology definition. */
export interface OntologyImplementation {
  readonly actions?: OntologyActionHandlers
  readonly functions?: OntologyFunctionHandlers
}
