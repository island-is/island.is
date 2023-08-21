# API Domains Driving License

## How to connect to xroad

To use it you need to have proxy the xroad socat service:

```bash
  ./scripts/run-xroad-proxy.sh
```

or

```bash
  kubectl -n socat port-forward svc/socat-xroad 8081:80
```

and make sure the environment variable DRIVING_LICENSE_SECRET is avaialable.

## Running unit tests

Run `nx test api-domains-driving-license-book` to execute the unit tests via
[Jest](https://jestjs.io).
