# Mocking national registry XROAD endpoints

## Prerequisites

Since the mock will be listening on port `8081`, the port forwarding for xroad needs to be listening on port `8082` as that is where the mock server will forward requests it does not have mock responses for.

To set the port forwarding to listen on port `8082` you can pass a port argument to the proxies script like so `yarn proxies xroad --p 8082`. Alternatively if you use kubectl and socat just replace `8081:80` with `8082:80`.

## How to

First you'll want to install [mockoon-cli](https://github.com/mockoon/mockoon/tree/main/packages/cli#installation), then you just call `mockoon-cli start --data <path to capture file>`. The capture file can be one you made yourself (see below) or one that has been checked in such as `national-registryv2.json` Mockoon will now start listening on port `8081` and proxying non-mocked traffic to port `8082`.

For more in-depth instructions, you can check out the [mockoon site](https://mockoon.com/cli/).

## Current mocks

Currently, only a capture file for the national registry V2 is included.

## What if I need to call an endpoint that isn't mocked

No problem, mockoon will transparently proxy whatever requests it does not have mocks for.

## My calls aren't being mocked

The mocks are currently set up for the Gervimaður Færeyjar fake person. If you need to mock other fake persons, you can download the [mockoon app](https://mockoon.com/download/) and either open the `national-registry.json` collection or start your own with [automocking](https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/).

## Does the mocking proxy only respond with mocks when the proxied service is down?

No, one of the benefits of mocking locally is a significantly shorter response time, and to achieve that, it's necessary to use mocks even if the underlying service is operational.
