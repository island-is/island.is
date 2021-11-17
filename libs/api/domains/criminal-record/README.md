# api-domains-criminal-record

This library was generated with [Nx](https://nx.dev). (yarn generate @nrwl/node:lib api/domains/criminal-record)

## How to connect to xroad

To use it you need to have proxy the xroad socat service:

```bash
  ./scripts/run-xroad-proxy.sh
```

or

```bash
  kubectl -n socat port-forward svc/socat-xroad 8081:80
```

and make sure the environment variable X? is avaialable.

## Running unit tests

Run `nx test api-domains-criminal-record` to execute the unit tests via [Jest](https://jestjs.io).
