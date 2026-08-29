/** Ontology capability Service Definition. @module aiko-dsh-bid-studio/ontology/runtime */
import { Context, Service } from '@deepseek-ai/cordis'
import type {
  CreateOntologyObjectRequest,
  OntologyActionId,
  OntologyDefinition,
  OntologyFunctionId,
  OntologyFunctionValue,
  OntologyImplementation,
  OntologyLink,
  OntologyLinkId,
  OntologyLinkQuery,
  OntologyObject,
  OntologyObjectTypeId,
  OntologyPropertyValue,
  CreateOntologyLinkRequest,
  UpdateOntologyObjectRequest,
} from './types.ts'

export * from './types.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Active ontology provider. */
    ontology: OntologyRuntime
  }
}

/** Provider contract for ontology definitions, graph state, Functions, and Actions. */
export abstract class OntologyRuntime extends Service {
  constructor(ctx: Context) {
    super(ctx, 'ontology')
  }

  /**
   * Register one definition contribution.
   * @param definition - Business definition.
   * @param implementation - Function and Action adapters.
   * @returns Contribution disposer.
   */
  abstract register(definition: OntologyDefinition, implementation?: OntologyImplementation): () => void
  /**
   * Return active definitions in registration order.
   * @returns Immutable snapshot.
   */
  abstract definitions(): readonly OntologyDefinition[]
  /**
   * Create and validate an object.
   * @param request - Object fields.
   * @returns Provider-owned object.
   */
  abstract createObject(request: CreateOntologyObjectRequest): Promise<OntologyObject>
  /**
   * Merge declared properties into a stored object.
   * @param request - Object id and property patch.
   * @returns Updated immutable object.
   */
  abstract updateObject(request: UpdateOntologyObjectRequest): Promise<OntologyObject>
  /**
   * List immutable objects.
   * @param type - Optional type filter.
   * @returns Matching objects.
   */
  abstract listObjects(type?: OntologyObjectTypeId): readonly OntologyObject[]
  /**
   * Create and validate a link.
   * @param request - Link type and endpoint ids.
   * @returns Provider-owned link.
   */
  abstract createLink(request: CreateOntologyLinkRequest): Promise<OntologyLink>
  /**
   * Delete one link.
   * @param id - Link id.
   * @returns Whether the link existed.
   */
  abstract deleteLink(id: OntologyLinkId): Promise<boolean>
  /**
   * List immutable links.
   * @param query - Optional endpoint and type filters.
   * @returns Matching links.
   */
  abstract listLinks(query?: OntologyLinkQuery): readonly OntologyLink[]
  /**
   * Execute a registered read-only Function.
   * @param functionId - Function id.
   * @param input - Function fields.
   * @returns Validated Function result.
   */
  abstract executeFunction(
    functionId: OntologyFunctionId,
    input: Readonly<Record<string, OntologyPropertyValue>>,
  ): Promise<OntologyFunctionValue>
  /**
   * Execute a registered Action.
   * @param action - Action id.
   * @param input - Action fields.
   * @returns Driver result.
   */
  abstract executeAction(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<unknown>
}

export default OntologyRuntime
