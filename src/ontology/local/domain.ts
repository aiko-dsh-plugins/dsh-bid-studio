/** Durable storage-domain declaration for local ontology objects. */
import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import type { OntologyLink, OntologyLinkId, OntologyObject, OntologyObjectId } from 'aiko-dsh-bid-studio/ontology/runtime'

const ontologyObjectSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  properties: z.record(z.string(), z.unknown()),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
}).strict() as unknown as z.ZodType<OntologyObject>

const ontologyLinkSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  createdAt: z.number().int().nonnegative(),
}).strict() as unknown as z.ZodType<OntologyLink>

/** Storage declaration for provider-owned ontology records. */
export const ontologyDomainSpec = defineDomain({
  name: 'ontology',
  version: 1,
  tables: {
    objects: domainTable<OntologyObjectId, OntologyObject>(ontologyObjectSchema),
    links: domainTable<OntologyLinkId, OntologyLink>(ontologyLinkSchema),
  },
})
