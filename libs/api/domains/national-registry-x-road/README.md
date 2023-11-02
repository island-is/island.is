# api-domains-national-registry-x-road

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test api-domains-national-registry-x-road` to execute the unit tests via [Jest](https://jestjs.io).

## About service

Documentation about [Þjóðskrá api](https://api-dev.skra.is)

Some endpoints from Þjóðskrá need a valid jwt token for authentication. The way chosen was to send the jwt token to Þjóðskrá in wrapped calls in `national-registry-x-road.service.ts`. The forsja endpoint is an example of this.

## How to connect to X-Road

To use it you need to have proxy the X-Road socat service:

```bash
  ./scripts/run-xroad-proxy.sh
```

or

```bash
  kubectl -n socat port-forward svc/socat-xroad 8080:80
```

and make sure the environment variables `XROAD_BASE_PATH_WITH_ENV`, `XROAD_TJODSKRA_MEMBER_CODE`, `XROAD_TJODSKRA_API_PATH` and `XROAD_CLIENT_ID` are available.

## Code owners and maintainers

- [Kolibri-Modern-Family](https://github.com/orgs/island-is/teams/kolibri-modern-family/members)
