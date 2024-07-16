# Mocking national registry XROAD endpoints

## Prerequisites

Since the mock will be listening on port `8081` the port forwarding for xroad needs to be listening on port `8082` as that is where the mock server will forward requests it does not have mock responses for

## How to

Just run `yarn mock-national-registry`

## Current mocks

Currently only mock responses for the national registry are included.

## What if I need to call an endpoint that isn't mocked

No problem, mockoon will transparently proxy whatever requests it does not have mocks for.

## My calls aren't being mocked

The mocks are currently set up for the Gervimaður Færeyjar fake person. If you need to mock other fake persons, you can download the [mockoon app](https://mockoon.com/download/) and either open the `national-registry.json` collection or start your own with [automocking](https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/)

## Does the mocking proxy only respond with mocks when the proxied service is down?

No, one of the benefits of mocking locally is a significantly shorter response time, and to achieve that, it's necessary to use mocks even if the underlying service is operational.
