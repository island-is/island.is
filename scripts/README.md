# Utility scripts

A collection of bash scripts to run utilities.

TODO: chapter for each script

## Cypress tests

Run required proxy services. Supports `podman`.

```bash
./scripts/run-test-proxies.sh [--builder BUILDER; default="docker"]
```

Stop proxies

```bash
./scripts/stop-test-proxies.sh [BUILDER; default="docker"]
```

## Dependency cruiser

A visual graph of module import resolution can help with debugging, especially in a large monorepo. The following script will output a `dot` file that can be rendered to svg (with GraphViz) and then to `html` to be opened in any browser.

```bash
# replace firefox with a browser of your choice
yarn cruise -p apps/services/sessions && firefox depgraph.html
```

This uses [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser) behind the scenes. Feel free to add `.dependency-cruiser.local.js` in the repo root to merge your custom config with the default.

## HMR benchmark

The following command can be used to benchmark the startup and hot-reload time of any NX `serve` targets. The default message is the service ready output for NestJS services.

Run `yarn hmr-benchmark --help` for available options

```bash
yarn hmr-benchmark --app <service name> --message <the output message to watch> --logfile [default: workspace root]
```

Example:

```bash
yarn hmr-benchmark --app services-sessions --message 'Nest application successfully started'
```
