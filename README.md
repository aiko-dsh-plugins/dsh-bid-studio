# Aiko DSH Bid Studio

An installable DeepSeek Harness business application that contributes:

- a Bid Studio entry in the Web application sidebar;
- a complete tender ontology with object, relationship, Function, and Action definitions;
- a durable local execution route from tender intake to human review and export;
- an ontology inspector that renders every definition category and workflow step.

Bid Studio is a scene plugin built on the independently installed [Aiko DSH Ontology Kernel](https://github.com/aiko-dsh-plugins/dsh-ontology-kernel). It contributes only the `bid.*` definition, executable adapters, tools, workflow, and workbench. The shared Kernel owns the ontology runtime, durable graph storage, and browser remotes so future contract and project workbenches can reuse one provider.

## Install from GitHub

```sh
dsh plugin --profile web add https://github.com/aiko-dsh-plugins/dsh-ontology-kernel/releases/download/v0.1.2/aiko-dsh-ontology-kernel-0.1.2.tgz https://github.com/aiko-dsh-plugins/dsh-bid-studio/releases/download/v0.2.0/aiko-dsh-bid-studio-0.2.0.tgz
dsh --profile web --dump-config
dsh --profile web
```

The repository commits its host and browser artifacts under `lib/`, so Git installation does not execute a `prepare` script. Pin the tag or a commit when reproducibility matters.

After the profile restarts, open **标书工作台** from the application sidebar. The current demo implementation persists projects and graph records locally, runs deterministic machine/workflow adapters, pauses for human approval, and exports a reviewable text artifact. AI-driven Action adapters remain an extension point of the Ontology Kernel.

Install the Kernel only once per profile. Multiple scene plugins can register independent namespaces such as `bid.*` and `contract.*` against that single runtime. The Aiko catalog-aware market installs required platform plugins automatically.

## Source provenance

The initial implementation was extracted from the public `packages/business/bid-studio` and `packages/bundle/bid-studio` packages in `qwe8652591/deepseek-harness` at commit `8bca1e10fc2066e18309cd5fc5a62bd69b78de13`. The extracted repository is the distribution surface; the Harness fork remains the integration workspace until the Electron composition migrates to this package.

## License

MIT
