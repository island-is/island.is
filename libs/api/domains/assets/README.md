# Real estate assets API

This service utilises the `FasteignirApi`

## How to use

Start the API:

```bash
yarn start api
```

X-road needs to be running

```bash
./scripts/run-xroad-proxy.sh
# or
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

`AssetsXRoadService` should now be available to use.

## UI

Example of usage can be found in your [local Service Portal](http://localhost:4200/minarsidur/fasteignir).
To start the Service portal:

```bash
yarn start service-portal
```

## Mocking

The data for assets API has been fully mocked, for mock usage and testing purposes try the API_MOCKS.

Add `API_MOCKS=true` to your `.env` file and make sure it is available in your webpack browser bundles ([Next.js example](../../../apps/web/next.config.js)).

## API Domains Assets

This library was generated with [Nx.js](https://nx.dev).

## Running unit tests

Run `nx test api-domains-assets` to execute the unit tests via [Jest](https://jestjs.io).
