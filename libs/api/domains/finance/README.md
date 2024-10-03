```markdown
# API Domains Finance

This API utilizes the [FinanceClientService](/libs/clients/finance/src/lib/FinanceClientService.ts).

## How to Use

1. **Start the API**:  
   Run the following command:
   ```bash
   yarn start api
   ```

2. **Ensure X-Road is Running**:  
   You can start it using one of the following methods:
   - Run the script:
     ```bash
     ./scripts/run-xroad-proxy.sh
     ```
   - Or use Kubernetes port forwarding:
     ```bash
     kubectl -n socat port-forward svc/socat-xroad 8081:80
     ```

   Once running, the Finance API will be available for use within `island.is`.

## UI

An example of usage can be found at: <http://localhost:4200/minarsidur/fjarmal>. Ensure the Service Portal is running by executing:
```bash
yarn start service-portal
```

## Mock

The data for the Finance API has been mocked for usage and testing purposes with `API_MOCKS`. 

To enable mock usage:
1. Add `API_MOCKS=true` to your `.env` file.
2. Ensure it is accessible in your Webpack browser bundles (see [Next.js example](../../../apps/web/next.config.js)).

## Running Unit Tests

Execute the unit tests with Jest by running:
```bash
nx test api-domains-finance
```
```