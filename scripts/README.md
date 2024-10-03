# Utility Scripts

A collection of bash scripts to run utilities.

TODO: Document each script in detail.

## Cypress Tests

Run required proxy services. Supports `podman`.

```bash
./scripts/run-test-proxies.sh [--builder BUILDER; default: "docker"]
```

Stop proxies:

```bash
./scripts/stop-test-proxies.sh [BUILDER; default: "docker"]
```

## Dependency Cruiser

A visual graph of module import resolution can help with debugging, especially in a large monorepo. The following command outputs a `dot` file that can be rendered to an SVG (with GraphViz) and then to an `html` file, viewable in any browser.

```bash
# replace "firefox" with a browser of your choice
yarn cruise -p apps/services/sessions && firefox depgraph.html
```

This uses [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser). Consider adding a `.dependency-cruiser.local.js` file in the repository root to merge your custom config with the default.

## HMR Benchmark

This command benchmarks the startup and hot-reload time of any NX `serve` targets. The default message is the service-ready output for NestJS services.

Run `yarn hmr-benchmark --help` for available options.

```bash
yarn hmr-benchmark --app <service_name> --message <output_message_to_watch> --logfile [default: workspace root]
```

Example:

```bash
yarn hmr-benchmark --app services-sessions --message 'Nest application successfully started'
```
