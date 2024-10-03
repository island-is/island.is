# Real Estate Assets API

This service utilizes the Fasteignir API.

## How to Use

Start the API:
```bash
yarn start api
```

Ensure X-road is running:

```bash
./scripts/run-xroad-proxy.sh
```

or

```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Once running, the `AssetsXRoadService` will be available.

## UI

Usage example: [Local Host Link](http://localhost:4200/minarsidur/fasteignir)

Ensure the service portal is running:
```bash
yarn start service-portal
```

## Mock

The assets API data is fully mocked. For mock usage/testing, enable `API_MOCKS`.

To use:

1. Add `API_MOCKS=true` to your `.env` file.
2. Ensure it is included in your webpack/browser bundles (e.g., see the Next.js example in `../../../apps/web/next.config.js`).

## API Domains Assets

This library was generated with [Nx](https://nx.dev).

### Running Unit Tests

Execute the unit tests with [Jest](https://jestjs.io) using:
```bash
nx test api-domains-assets
```