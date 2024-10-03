```markdown
# API Domains Driving License

## Quickstart

To begin developing, run the following command:

```bash
yarn nx run api-domains-driving-license:dev
```

This command is currently an alias for the xroad-proxy script detailed below.

## Connecting to X-Road

In order to connect, you need to proxy the X-Road socat service. You can do this by executing:

```bash
./scripts/run-xroad-proxy.sh
```

or by using Kubernetes:

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Additionally, ensure that the environment variable `DRIVING_LICENSE_SECRET` is set.

## Running Unit Tests

To execute the unit tests, run the following command, which utilizes [Jest](https://jestjs.io):

```bash
nx test api-domains-driving-license
```
```