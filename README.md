# Aiko DSH Bid Studio

An installable DeepSeek Harness business application that contributes:

- a Bid Studio entry in the Web application sidebar;
- a complete tender ontology with object, relationship, Function, and Action definitions;
- a durable local execution route from tender intake to human review and export;
- an ontology inspector that renders every definition category and workflow step.

The bundle depends on [Aiko DSH Ontology Kernel](https://github.com/aiko-dsh-plugins/dsh-ontology-kernel) and activates its local and remote adapters. Users install one Bid Studio bundle rather than assembling its internal modules.

## Install from GitHub

```sh
dsh plugin --profile web add https://codeload.github.com/aiko-dsh-plugins/dsh-bid-studio/tar.gz/refs/tags/v0.1.2
dsh --profile web --dump-config
dsh --profile web
```

The repository commits its host and browser artifacts under `lib/`, so Git installation does not execute a `prepare` script. Pin the tag or a commit when reproducibility matters.

After the profile restarts, open **标书工作台** from the application sidebar. The current demo implementation persists projects and graph records locally, runs deterministic machine/workflow adapters, pauses for human approval, and exports a reviewable text artifact. AI-driven Action adapters remain an extension point of the Ontology Kernel.

Do not also activate the standalone Ontology Kernel bundle in the same profile: Bid Studio already inserts its adapters. Installing the kernel as a transitive package is expected; adding it as a second profile layer would duplicate the same configuration rows.

## Source provenance

The initial implementation was extracted from the public `packages/business/bid-studio` and `packages/bundle/bid-studio` packages in `qwe8652591/deepseek-harness` at commit `8bca1e10fc2066e18309cd5fc5a62bd69b78de13`. The extracted repository is the distribution surface; the Harness fork remains the integration workspace until the Electron composition migrates to this package.

## License

MIT
