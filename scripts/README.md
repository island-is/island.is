# Utility scripts

A collection of bash scripts to run utilities.

TODO: chapter for each script

## E2E tests

Run required proxy services. Supports `podman`.

```bash
./scripts/run-test-proxies.sh [--builder BUILDER; default="docker"]
```

Stop proxies

```bash
./scripts/stop-test-proxies.sh [BUILDER; default="docker"]
```
