# API Domains Finance

This api utilises the [financeService](/libs/clients/finance/src/lib/FinanceClientService.ts)

# How to use

Start the api
`yarn start api`

X-road needs to be running

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Finance API should now be available to use within island.is

# UI

Example of usage can be found in: http://localhost:4200/minarsidur/fjarmal

Service portal needs to be running.
`yarn start service-portal`

# Mock

The data for finance api has been mocked, for mock usage and testing purposes try the API_MOCKS.

Add `API_MOCKS=true` to your `.env` file and make sure it is available in your webpack browser bundles ([Next.JS example](../../../apps/web/next.config.js)).

## Running unit tests

Run `nx test api-domains-finance` to execute the unit tests via [Jest](https://jestjs.io).
