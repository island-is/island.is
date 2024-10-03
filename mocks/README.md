## Mocking REST endpoints with recorded data

It can be incredibly useful to be able to alter responses from a REST endpoint or even entirely replace an unavailable one. This README covers how to do that with Mockoon.

## Proxying XROAD

To set the mock to listen on port `8081` for requests from local services and forward unmocked requests to port `8082` for XROAD, follow the steps below:
- For port forwarding to listen on port `8082`, use `yarn proxies xroad --p 8082` or adjust port settings in `kubectl` and `socat`.

## Mockoon-CLI

If you wish to proxy and mock using existing mock data, install [mockoon-cli](https://github.com/mockoon/mockoon/tree/main/packages/cli#installation). Start the mock server with `mockoon-cli start --data <path to capture file>`, where the capture file can be one you created or a pre-existing one like `national-registryv2.json`. Mockoon will now run on port `8081` and proxy non-mocked requests to port `8082`.

For detailed instructions, refer to the [mockoon site](https://mockoon.com/cli/).

## Current mocks

### Applications

Check the mockData directory within the application for available mock data. If creating new mock data, store it in the appropriate directory.

## Q&A

### What if I need to call an endpoint that isn't mocked?

Mockoon will proxy requests it lacks mocks for transparently.

### What if I want an actual response from a mocked endpoint?

In the `Routes` panel, locate the endpoint, click the three dots at the top right, and choose `Toggle` to switch from mocking to proxying.

### What if I need to update the mocked data for an endpoint?

Delete the existing endpoint, enable recording, make a call to the endpoint, and use the returned data. Alternatively, toggle off the mock, make a call, and copy the response data from the log.

### My calls aren't being mocked?

The mock setup is for the Gervimaður Færeyjar fake person. For other fake persons, use the [mockoon app](https://mockoon.com/download/) either with an existing collection or with [automocking](https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/).

### Does the mocking proxy only respond with mocks when the proxied service is down?

No, mocking locally provides quicker response times. To send calls to the proxied endpoint, disable the mock in the `Routes` tab.