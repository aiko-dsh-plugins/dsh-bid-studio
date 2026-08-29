/** Sidebar navigation contribution for Bid Studio. */
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ApplicationNavigationSnapshot } from '@deepseek-ai/dsh-client-ui-layout/client'
import css from './BidStudio.module.css'

type Props = PropsRuntime<'sidebar.application'> & {
  applicationId: string
  open: () => void
  useLayout: <T>(selector: (snapshot: ApplicationNavigationSnapshot) => T) => T
}

/** Render the wide or compact bid-workbench navigation button. */
export function BidNavigation({ wide, applicationId, open, useLayout }: Props) {
  const active = useLayout(snapshot => snapshot.activeApplication === applicationId)
  return (
    <button
      type="button"
      className={css.nav}
      data-active={active || undefined}
      aria-label="投标工作台"
      aria-current={active ? 'page' : undefined}
      onClick={open}
    >
      <span className={css.navIcon} aria-hidden="true">标</span>
      {wide && <span>投标工作台</span>}
    </button>
  )
}
