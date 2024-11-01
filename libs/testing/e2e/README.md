# E2E Testing

This library was generated with [Nx](https://nx.dev). It contains utility functions and configuration files that assist with end-to-end (E2E) testing in Playwright for various apps.

## Overview

This library includes:

- **Helper Functions:** Utility functions designed to streamline E2E testing with Playwright. These functions cater to different applications across the project and help automate common testing workflows.
- **Global Playwright Configuration:** The `createGlobalConfig` function provides a shared Playwright configuration used across multiple applications. It standardizes the testing environment.

## Mockoon Usage Guide for E2E Tests

This section explains how to use [Mockoon](https://mockoon.com/) to set up mock APIs for end-to-end (e2e) testing.

### What is Mockoon?

[Mockoon](https://mockoon.com/) is an open-source tool for creating mock APIs quickly and easily. It allows developers to simulate backend servers without relying on live backend services. This is especially useful for e2e testing, where consistency and repeatability of backend responses are important.

Mockoon provides both a graphical user interface (GUI) for managing API mock files and a command-line interface (CLI) for running these mocks in various environments, such as pipelines.

### Opening an Existing Mock File in Mockoon

To view or modify an existing mock file:

1. Open Mockoon.
2. Click on **+** and then click on **Open Local Environment**.
3. Choose the desired mock file, such as `apps/<my-app>/e2e/mocks/<my-app-mock>.json`.

This will load the mock configuration into the Mockoon UI, allowing you to inspect and edit the mock endpoints.

### Creating a Mock File with Mockoon UI

To create or modify a mock file:

1. Download and install [Mockoon](https://mockoon.com/download/) if you haven't already.
2. Open Mockoon and create a new environment:
   - Click on **+** and then click on **New Local Environment**.
   - Nema your mock file and choose a location for it e.g. `apps/<my-app>/e2e/mocks/<my-app-mock>.json`.
   - Add endpoints, routes, and response details as needed.

### Running a Mockoon Server with the CLI

To run a mock server with the cli, use the following command:

```bash
yarn mockoon-cli start --data ./apps/<my-app>/e2e/mocks/<my-app-mock>.json --port <port>
```
