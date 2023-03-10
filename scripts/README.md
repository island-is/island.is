# Utility scripts

A collection of bash scripts to run utilities.

## Contentful

Export all contentful data to json and upload to s3

```bash
./scripts/contentful-export.sh [dev]
```

## Cypress tests

Run required proxy services. Supports `podman`.

```bash
./scripts/run-test-proxies.sh [--builder BUILDER; default="docker"]
```

Stop proxies

```bash
./scripts/stop-test-proxies.sh [BUILDER; default="docker"]
```
