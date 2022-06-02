# Utility scripts

A collection of bash scripts to run utilities.

TODO: chapter for each script

## k6

Run required proxy services. Supports `podman`.

```bash
./scripts/run-k6-proxies.sh [--builder BUILDER; default="docker"]
```

Stop proxies

```bash
./scripts/stop-k6-proxies.sh [BUILDER; default="docker"]
```
