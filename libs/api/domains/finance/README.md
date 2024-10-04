# API Domains Finance

This API utilizes the [FinanceClientService](libs/clients/finance/src/lib/FinanceClientService.ts).

## How to Use

Start the API:

```bash
yarn start api
```

Ensure X-Road is running:

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Finance API should now function on island.is.

## UI

Example usage: [Service Portal Financials](http://localhost:4200/minarsidur/fjarmal)

To run the service portal:

```bash
yarn start service-portal
```

## Mock

Finance API data can be mocked. For usage, set `API_MOCKS=true` in your `.env` file and make it available in your webpack browser bundles (e.g., see the [Next.js configuration](../../../apps/web/next.config.js)).

## Running Unit Tests

Execute unit tests with:

```bash
yarn nx test api-domains-finance
```

Uses [Jest](https://jestjs.io).
