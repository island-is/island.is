```markdown
# Templates

## Mocking XROAD Endpoints with Mockoon for Templates

### Prerequisites

Services running locally typically make their calls on port `8081`, hence, the mock server should listen on port `8081`. This necessitates setting the XROAD port forwarding to port `8082` (or another port). Subsequently, the mock server will forward requests it does not have mock responses for to this port.

To configure the port forwarding to listen on port `8082`, you can pass a port argument to the proxies script like so: `yarn proxies xroad --p 8082`. Alternatively, if using `kubectl` and `socat`, replace `8081:80` with `8082:80`.

### How to Use

The Mockoon CLI is a development dependency and should be installed automatically when you run `yarn`. To use the Mockoon CLI, execute: `mockoon-cli start --data <path to capture file>`. The capture file may be user-generated (instructions below), or pre-existing for certain applications, located under `libs/application/<application name>/mockData`.

Mockoon should now be listening on port `8081` and proxying non-mocked traffic to port `8082`.

For more comprehensive instructions, refer to the [Mockoon documentation](https://mockoon.com/cli/).

### Mockoon App

It is highly recommended to install the [Mockoon App](https://mockoon.com/download/) as it enables functionalities like capturing new mock data, selecting endpoints to mock, or modifying mocked payloads, among others.

### Current Mocks

If an application has available mock data, it should reside in the `mockData` directory of the specific application (see instructions above). If you create mock data for an application currently lacking it, consider adding it to the appropriate directory.

## Q&A

### What if I Need to Call an Endpoint That Isn't Mocked?

No worries, Mockoon will seamlessly proxy requests it lacks mocks for.

### What if I Want to Get an Actual Response from a Mocked Endpoint?

Locate the endpoint in the `Routes` panel, click on the three dots on the upper right corner of the route entry, and select `Toggle`. This setting proxies incoming requests instead of mocking them.

### What if I Want to Update the Mocked Data for an Endpoint?

The simplest method is to delete the existing endpoint from the routes list as mentioned above, turn on the recording function by clicking the dot in the `Logs` tab above the request list, and then perform a call to the endpoint. Alternatively, toggle the endpoint mock off, perform a call, locate the log of that call in the logs tab, and copy over the returned data.

### My Calls Aren't Being Mocked

The current mocks are designed for the fictional character Gervimaður Færeyjar. If you need to mock other fictional characters, download the [Mockoon App](https://mockoon.com/download/) and either open the applicable collection or start a new one using [automatic mocking](https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/).

### Does the Mocking Proxy Only Respond with Mocks When the Proxied Service is Down?

No, a significant advantage of local mocking is the reduced response time, which requires utilizing mocks even when the proxied service is operational. If you wish to send calls to the proxied endpoint, you can toggle the mock off in the `Routes` tab.
```
