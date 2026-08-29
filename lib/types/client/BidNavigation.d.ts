/** Sidebar navigation contribution for Bid Studio. */
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { ApplicationNavigationSnapshot } from '@deepseek-ai/dsh-client-ui-layout/client';
type Props = PropsRuntime<'sidebar.application'> & {
    applicationId: string;
    open: () => void;
    useLayout: <T>(selector: (snapshot: ApplicationNavigationSnapshot) => T) => T;
};
/** Render the wide or compact bid-workbench navigation button. */
export declare function BidNavigation({ wide, applicationId, open, useLayout }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=BidNavigation.d.ts.map