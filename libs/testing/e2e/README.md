# E2E Testing Helpers for Playwright

This library was generated with [Nx](https://nx.dev). It contains utility functions and configuration files that assist with end-to-end (E2E) testing in Playwright for various apps in our project. Here's a breakdown of the main components:

## Overview

- **Helper Functions:** Utility functions designed to streamline E2E testing with Playwright. These functions cater to different applications across the project and help automate common testing workflows.
- **Mockoon JSON Files:** This directory also includes [Mockoon](https://mockoon.com/) JSON files, which can be used to mock APIs during Playwright E2E tests. These mock data files simulate server responses from x-road.
- **Global Playwright Configuration:** The `createGlobalConfig` function provides a shared Playwright configuration used across multiple applications. It standardizes the testing environment.
