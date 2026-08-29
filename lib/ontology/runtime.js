import { Service } from "@deepseek-ai/cordis";
//#region lib/types/types.js
/**
* Construct a definition id from a trusted package-owned literal.
* @param value - Namespaced id.
* @returns Branded id.
*/
const OntologyDefinitionId = (value) => value;
/**
* Construct an object-type id from a trusted package-owned literal.
* @param value - Namespaced id.
* @returns Branded id.
*/
const OntologyObjectTypeId = (value) => value;
/**
* Construct a link-type id from a trusted package-owned literal.
* @param value - Namespaced id.
* @returns Branded id.
*/
const OntologyLinkTypeId = (value) => value;
/**
* Construct a Function id from a trusted package-owned literal.
* @param value - Namespaced id.
* @returns Branded id.
*/
const OntologyFunctionId = (value) => value;
/**
* Construct an Action id from a trusted package-owned literal.
* @param value - Namespaced id.
* @returns Branded id.
*/
const OntologyActionId = (value) => value;
/**
* Construct an object id from a trusted runtime value.
* @param value - Provider id.
* @returns Branded id.
*/
const OntologyObjectId = (value) => value;
/**
* Construct a link id from a trusted runtime value.
* @param value - Provider id.
* @returns Branded id.
*/
const OntologyLinkId = (value) => value;
//#endregion
//#region lib/types/index.js
/** Ontology capability Service Definition. @module aiko-dsh-bid-studio/ontology/runtime */
/** Provider contract for ontology definitions, graph state, Functions, and Actions. */
var OntologyRuntime = class extends Service {
	constructor(ctx) {
		super(ctx, "ontology");
	}
};
//#endregion
export { OntologyActionId, OntologyDefinitionId, OntologyFunctionId, OntologyLinkId, OntologyLinkTypeId, OntologyObjectId, OntologyObjectTypeId, OntologyRuntime, OntologyRuntime as default };
