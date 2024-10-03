```markdown
# Real Estate Assets API

This service utilizes the Fasteignir API.

## How to Use

### Starting the API

To start the API, run the following command:
```bash
yarn start api
```

### Setting Up X-Road

Ensure that X-Road is running. You can start it using one of the following methods:

**Using Script**:
```bash
./scripts/run-xroad-proxy.sh
```

**Using Kubernetes**:
```bash
kubectl -n socat port-forward svc/socat-xroad 8081:80
```

Once X-Road is set up, the `AssetsXRoadService` should now be available for use.

## User Interface (UI)

An example of how to use the UI can be found at: [http://localhost:4200/minarsidur/fasteignir](http://localhost:4200/minarsidur/fasteignir).

To run the service portal, use:
```bash
yarn start service-portal
```

## Mock Data

The data for the assets API is fully mocked for testing purposes. To use mock data, set the environment variable `API_MOCKS=true`.

Add `API_MOCKS=true` to your `.env` file and ensure it is available in your Webpack browser bundles. For example, see the [Next.js configuration](../../../apps/web/next.config.js).

## API Domains: Assets

This library was generated using [Nx](https://nx.dev).

### Running Unit Tests

To execute the unit tests via [Jest](https://jestjs.io), run the following command:
```bash
nx test api-domains-assets
```
```