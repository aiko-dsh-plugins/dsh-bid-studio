/** Bid Studio browser plugin: application navigation row and keyed workbench page. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { BidNavigation } from './BidNavigation.tsx'
import { BidStudio } from './BidStudio.tsx'
import { BID_ONTOLOGY } from '../definition.ts'

/** Key shared by the navigation command and keyed application slot. */
export const BID_STUDIO_APPLICATION_ID = 'bid-studio'

/** Services required by the browser half. */
export const inject = ['slots', 'layout', 'remote', 'remote.ontologyRemote']

/** Register the menu and page as independently disposable slot contributions. */
export function apply(ctx: ClientContext): void {
  const remote = {
    async listObjects(type?: Parameters<typeof ctx.remote.ontologyRemote.listObjects>[0]) {
      const result = await ctx.remote.ontologyRemote.listObjects(type)
      if (!result.ok) throw new Error(`${result.error.message} (${result.error.code})`)
      return result.value
    },
    async execute(
      action: Parameters<typeof ctx.remote.ontologyRemote.executeAction>[0],
      input: Parameters<typeof ctx.remote.ontologyRemote.executeAction>[1],
    ) {
      const result = await ctx.remote.ontologyRemote.executeAction(action, input)
      if (!result.ok) throw new Error(`${result.error.message} (${result.error.code})`)
      return result.value
    },
  }
  ctx.slots.inject('sidebar.application', () => ctx.slots.register({
    name: 'sidebar.application',
    id: 'bid-studio-navigation',
    order: 100,
    inject: () => ({
      applicationId: BID_STUDIO_APPLICATION_ID,
      open: () => { ctx.layout.openApplication(BID_STUDIO_APPLICATION_ID) },
      hooks: { layout: ctx.layout },
    }),
  }, BidNavigation))
  ctx.slots.inject('application', () => ctx.slots.register({
    name: 'application',
    key: BID_STUDIO_APPLICATION_ID,
    inject: () => ({
      definition: BID_ONTOLOGY,
      remote,
      close: () => { ctx.layout.closeApplication() },
    }),
  }, BidStudio))
}
