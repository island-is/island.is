```markdown
# Utility Scripts

A collection of bash scripts to run various utilities.

## Cypress Tests

Run required proxy services. Supports both `docker` and `podman`.

### Run Test Proxies

```bash
./scripts/run-test-proxies.sh [--builder BUILDER; default="docker"]
```

### Stop Test Proxies

```bash
./scripts/stop-test-proxies.sh [--builder BUILDER; default="docker"]
```

## Dependency Cruiser

Generate a visual graph of module import resolution to aid debugging in large monorepos:

```bash
# Replace 'firefox' with your preferred browser
yarn cruise -p apps/services/sessions && firefox depgraph.html
```

This command relies on [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser). Customize configuration by creating a `.dependency-cruiser.local.js` file in the repository root.

## HMR Benchmark

Benchmark startup and hot-reload time of NX `serve` targets, useful for evaluating NestJS services performance.

```bash
yarn hmr-benchmark --help
yarn hmr-benchmark --app <service name> --message <expected startup message> --logfile [default: workspace root]
```

Example:

```bash
yarn hmr-benchmark --app services-sessions --message 'Nest application successfully started'
```
```