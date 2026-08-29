import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/index.js
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/** Remote Consumer that keeps transport concerns out of the Provider interface. */
let OntologyRemote = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _definitions_decorators;
	let _listObjects_decorators;
	let _listLinks_decorators;
	let _executeFunction_decorators;
	let _executeAction_decorators;
	return class OntologyRemote extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_definitions_decorators = [Remote("definitions")];
			_listObjects_decorators = [Remote("listObjects")];
			_listLinks_decorators = [Remote("listLinks")];
			_executeFunction_decorators = [Remote("executeFunction")];
			_executeAction_decorators = [Remote("executeAction")];
			__esDecorate(this, null, _definitions_decorators, {
				kind: "method",
				name: "definitions",
				static: false,
				private: false,
				access: {
					has: (obj) => "definitions" in obj,
					get: (obj) => obj.definitions
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listObjects_decorators, {
				kind: "method",
				name: "listObjects",
				static: false,
				private: false,
				access: {
					has: (obj) => "listObjects" in obj,
					get: (obj) => obj.listObjects
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listLinks_decorators, {
				kind: "method",
				name: "listLinks",
				static: false,
				private: false,
				access: {
					has: (obj) => "listLinks" in obj,
					get: (obj) => obj.listLinks
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _executeFunction_decorators, {
				kind: "method",
				name: "executeFunction",
				static: false,
				private: false,
				access: {
					has: (obj) => "executeFunction" in obj,
					get: (obj) => obj.executeFunction
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _executeAction_decorators, {
				kind: "method",
				name: "executeAction",
				static: false,
				private: false,
				access: {
					has: (obj) => "executeAction" in obj,
					get: (obj) => obj.executeAction
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = ["ontology"];
		constructor(ctx) {
			super(ctx, "ontologyRemote");
			__runInitializers(this, _instanceExtraInitializers);
		}
		/**
		* Return every active versioned definition.
		* @returns Active definitions in registration order.
		*/
		definitions() {
			return this.ctx.ontology.definitions();
		}
		/**
		* Return current object snapshots.
		* @param type - Optional object-type filter.
		* @returns Matching immutable objects.
		*/
		listObjects(type) {
			return this.ctx.ontology.listObjects(type);
		}
		/**
		* Return current link snapshots.
		* @param query - Optional endpoint and type filters.
		* @returns Matching immutable links.
		*/
		listLinks(query) {
			return this.ctx.ontology.listLinks(query);
		}
		/**
		* Execute one registered read-only Function.
		* @param functionId - Function id.
		* @param input - Scalar Function fields.
		* @returns Validated Function result.
		*/
		async executeFunction(functionId, input) {
			return await this.ctx.ontology.executeFunction(functionId, input);
		}
		/**
		* Execute one registered Action through the Provider's declared route.
		* @param action - Action id.
		* @param input - Scalar Action fields.
		* @returns Object created or returned by the Action.
		*/
		async executeAction(action, input) {
			return await this.ctx.ontology.executeAction(action, input);
		}
	};
})();
//#endregion
export { OntologyRemote, OntologyRemote as default };
