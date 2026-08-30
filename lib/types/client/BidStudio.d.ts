import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { OntologyActionId, OntologyDefinition, OntologyObject, OntologyObjectTypeId, OntologyPropertyValue } from 'aiko-dsh-ontology-kernel/runtime';
interface BidStudioRemote {
    listObjects(type?: OntologyObjectTypeId): Promise<readonly OntologyObject[]>;
    execute(action: OntologyActionId, input: Readonly<Record<string, OntologyPropertyValue>>): Promise<unknown>;
}
type Props = PropsRuntime<'application'> & {
    definition: OntologyDefinition;
    remote: BidStudioRemote;
    close: () => void;
};
/** Render the operational workbench and its secondary ontology inspector. */
export declare function BidStudio({ definition, remote, close }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=BidStudio.d.ts.map
