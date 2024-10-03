```markdown
# API Domains: Driving License

## How to Connect to X-Road

To connect to the X-Road service, you need to proxy the X-Road Socat service. You can do this by executing one of the following commands:

### Using a Script

```bash
./scripts/run-xroad-proxy.sh
```

### Using Kubernetes

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Make sure that the environment variable `DRIVING_LICENSE_SECRET` is properly set.

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
nx test api-domains-driving-license-book
```
```