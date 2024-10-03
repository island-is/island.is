## Mocking REST Endpoints with Recorded Data

This guide explains how to alter or replace responses from a REST endpoint using Mockoon.

### Proxying XROAD

Local services default to port `8081`, and the mock server listens here. Forward XROAD traffic using port `8082` with `yarn proxies xroad --p 8082`. Alternatively, if using kubectl and socat, change `8081:80` to `8082:80`.

### Mockoon-CLI

To proxy and mock using existing data:

1. Install [Mockoon CLI](https://github.com/mockoon/mockoon/tree/main/packages/cli#installation).
2. Run `mockoon-cli start --data <path to capture file>`. Use files like `national-registryv2.json`.

For detailed guidance, visit [Mockoon CLI documentation](https://mockoon.com/cli/).

### Current Mocks

Mock data for applications should be stored in the respective application's `mockData` directory. Add new mock data as needed.

### Q&A

**What if I need to call a non-mocked endpoint?**

Mockoon will automatically proxy requests it lacks mocks for.

**How to get actual responses from a mocked endpoint?**

In the `Routes` panel, toggle the endpoint by selecting `Toggle` in the route entry menu.

**How to update mocked data for an endpoint?**

Delete the endpoint by selecting `Delete`, enable recording in the `Logs` tab, and make a call to update data. Alternatively, toggle off the endpoint, make a call, and copy the response data from the logs.

**Why aren't my calls being mocked?**

Mocks are set for the demo user "Gervimaður Færeyjar." To mock other users, use the [Mockoon app](https://mockoon.com/download/) for custom setups.

**Does the proxy only use mocks if the service is down?**

No, local mocks provide faster responses. Toggle the mock off in `Routes` if you wish to reach the actual service.