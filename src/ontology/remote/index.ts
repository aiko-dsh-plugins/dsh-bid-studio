/** Browser-safe Remote projection of the active ontology Provider. */
import type { Context } from '@deepseek-ai/cordis'
import type {
  OntologyActionId,
  OntologyDefinition,
  OntologyFunctionId,
  OntologyFunctionValue,
  OntologyLink,
  OntologyLinkQuery,
  OntologyObject,
  OntologyObjectTypeId,
  OntologyPropertyValue,
} from 'aiko-dsh-bid-studio/ontology/types'
import type {} from 'aiko-dsh-bid-studio/ontology/runtime'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
// Typert-generated ./typert and ./remote artifacts import Zod at runtime.
import type {} from 'zod'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Remote-safe ontology reads and Action dispatch. */
    ontologyRemote: OntologyRemote
  }
}

/** Remote Consumer that keeps transport concerns out of the Provider interface. */
export class OntologyRemote extends TypertRemoteService {
  static inject = ['ontology']

  constructor(ctx: Context) {
    super(ctx, 'ontologyRemote')
  }

  /**
   * Return every active versioned definition.
   * @returns Active definitions in registration order.
   */
  @Remote('definitions')
  definitions(): readonly OntologyDefinition[] {
    return this.ctx.ontology.definitions()
  }

  /**
   * Return current object snapshots.
   * @param type - Optional object-type filter.
   * @returns Matching immutable objects.
   */
  @Remote('listObjects')
  listObjects(type?: OntologyObjectTypeId): readonly OntologyObject[] {
    return this.ctx.ontology.listObjects(type)
  }

  /**
   * Return current link snapshots.
   * @param query - Optional endpoint and type filters.
   * @returns Matching immutable links.
   */
  @Remote('listLinks')
  listLinks(query?: OntologyLinkQuery): readonly OntologyLink[] {
    return this.ctx.ontology.listLinks(query)
  }

  /**
   * Execute one registered read-only Function.
   * @param functionId - Function id.
   * @param input - Scalar Function fields.
   * @returns Validated Function result.
   */
  @Remote('executeFunction')
  async executeFunction(
    functionId: OntologyFunctionId,
    input: Readonly<Record<string, OntologyPropertyValue>>,
  ): Promise<OntologyFunctionValue> {
    return await this.ctx.ontology.executeFunction(functionId, input)
  }

  /**
   * Execute one registered Action through the Provider's declared route.
   * @param action - Action id.
   * @param input - Scalar Action fields.
   * @returns Object created or returned by the Action.
   */
  @Remote('executeAction')
  async executeAction(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<OntologyObject> {
    return await this.ctx.ontology.executeAction(action, input) as OntologyObject
  }
}

export default OntologyRemote
