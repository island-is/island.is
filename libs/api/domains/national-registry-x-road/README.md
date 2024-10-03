```markdown
# API Domains National Registry X-Road

This library was generated with [Nx](https://nx.dev).

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
nx test api-domains-national-registry-x-road
```

## About the Service

For documentation on the [Þjóðskrá API](https://api-dev.skra.is), some endpoints require a valid JWT token for authentication. The chosen approach was to send the JWT token to Þjóðskrá through wrapped calls in `national-registry-x-road.service.ts`. The forsja endpoint is an example of this implementation.

## How to Connect to X-Road

To use this service, you must proxy the X-Road Socat service. You can do this by executing one of the following commands:

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8080:80
```

Ensure that the following environment variables are set:

- `XROAD_BASE_PATH_WITH_ENV`
- `XROAD_TJODSKRA_MEMBER_CODE`
- `XROAD_TJODSKRA_API_PATH`
- `XROAD_CLIENT_ID`

## Code Owners and Maintainers

- [Kolibri-Modern-Family](https://github.com/orgs/island-is/teams/kolibri-modern-family/members)
```