# Mocking REST endpoints with recorded data

It can be incredibly useful to be able to alter responses from a REST endpoint or even entirely replace an unavailable one.

This readme covers how to do that with Mockoon

## Proxying XROAD

Since the requests from the services we are running locally default to making their calls on port `8081`so the mock will be listening on port `8081`. This means the port forwarding for xroad needs to be listening on port `8082` (or some other port) and then we will set the mock server will forward requests it does not have mock responses for to that port.

To set the port forwarding to listen on port `8082` you can pass a port argument to the proxies script like so `yarn proxies xroad --p 8082`. Alternatively if you use kubectl and socat just replace `8081:80` with `8082:80`.

## Mockoon-CLI

If you only want to proxy and mock using existing mock data, you'll want to install [mockoon-cli](https://github.com/mockoon/mockoon/tree/main/packages/cli#installation). Then you just call `mockoon-cli start --data <path to capture file>`. The capture file can be one you made yourself (see below) or one that has been checked in such as `national-registryv2.json` Mockoon will now start listening on port `8081` and proxying non-mocked traffic to port `8082`.

For more in-depth instructions, you can check out the [mockoon site](https://mockoon.com/cli/).

## Current mocks

### Applications

If mockdata is available for an application it should be in the mockData directory in the application in question (see above under how to). If you create mock data for an application that doesn't have any, consider adding it under the appropriate directory.

## Q&A

### What if I need to call an endpoint that isn't mocked

No problem, mockoon will transparently proxy whatever requests it does not have mocks for.

### What if I want to get an actual response from an endpoint being mocked

Find the endpoint in question in the `Routes` panel, click on the three little dots in the upper right corner of the route entry and select `Toggle`. This will cause any incoming requests to be proxied rather than mocked.

### What if I want to update the mocked data for an endpoint

The simplest way is to delete the existing endpoint by finding it in the routes list as above but selecting `Delete` instead of `Toggle`, turning on the recording function by clicking the little dot in the `Logs` tab above the request list and then performing a call to the underlying endpoint. You can also toggle the endpoint mock off as described above, do a call to the endpoint, find the log for that call in the logs tab and simply copy over the returned data.

### My calls aren't being mocked

The mocks are currently set up for the Gervimaður Færeyjar fake person. If you need to mock other fake persons, you can download the [mockoon app](https://mockoon.com/download/) and either open the applicable collection or start your own with [automocking](https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/).

### Does the mocking proxy only respond with mocks when the proxied service is down?

No, one of the benefits of mocking locally is a significantly shorter response time, and to achieve that, it's necessary to use mocks even if the underlying service is operational. If you want to send calls to the proxied endpoint you can toggle the mock off in the `Routes` tab.
