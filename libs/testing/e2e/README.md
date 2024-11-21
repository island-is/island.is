# E2E Testing Library

This library contains utility functions, shared configuration, and documentation to assist with end-to-end (E2E) testing for all apps using Playwright.

## 📚 Overview

### Contents

- **🔧 Helper Functions**: Utility functions to simplify and standardize E2E testing across apps.
- **⚙️ Shared Playwright Configuration**: A common configuration used as the base for all app-specific Playwright configurations.
- **🌍 Multi-Environment Testing**: Support for running tests in `local`, `dev`, `staging`, and `prod` environments.

## 🚀 How to Use This Library

### Importing Helper Functions

To use helper functions in your tests, import them directly from this library:

```typescript
import { myHelperFunction } from '@island.is/testing/e2e'
```

### Extending the Common Playwright Config

Each app should create its own `playwright.config.ts` file that extends the shared configuration:

```typescript
import { createPlaywrightConfig } from '@island.is/testing/e2e'

const playwrightConfig = createPlaywrightConfig({
  webServerUrl: '<web-server-url>',
  command: '<command>',
  // Add any app-specific configurations here
})

export default playwrightConfig
```

## 🏃 Running Tests

Use the following command structure to run tests for any app:

```bash
yarn nx e2e <app-name>
```

### Useful Playwright Commands and Flags

- **Run with UI Mode**: Launch the tests with a UI to select and debug tests interactively.

  ```bash
  yarn nx e2e <app-name> --ui
  ```

- **Run Tests Without Caching**: Ensure a fresh run of tests without using cached results.

  ```bash
   yarn nx e2e <app-name> --skip-nx-cache
  ```

- **Run Tests with Tags**: Use tags to include or exclude specific tests.

  ```bash
    # Run only tests tagged with @fast
    yarn nx e2e <app-name> --grep @fast

    # Exclude tests tagged with @fast
    yarn nx e2e <app-name> --grep-invert @fast

    # Run tests tagged with either @fast or @slow
    yarn nx e2e <app-name> --grep "@fast|@slow"
  ```

- **View the Test Report**: After running tests, use this command to view the generated report:

  ```bash
  yarn playwright show-report
  ```

- **Run Specific Tests**: Use `--grep` to run tests matching a specific pattern:

  ```bash
  yarn nx e2e <app-name> --grep "Home Page Test"
  ```

- **Debug Mode**: Run tests in debug mode for better visibility:

  ```bash
  yarn nx e2e <app-name> --debug
  ```

For more details on Playwright commands and flags, refer to the [official documentation](https://playwright.dev/docs/test-cli)

## ✍️ Writing Tests

Run `yarn playwright codegen <url-to-your-app> --output <path/to/your/app/spec.ts>` and modify the output. The selectors need special attention; they should be transformed to use roles or `data-testid` attributes for stability (see below on how to).

### 🤔 What to Test

Writing tests for every possible combination is time-consuming for you and the CI pipeline, with diminishing value beyond the most common cases.

You should therefore aim to write test for:

- Most common usage patterns
- Usage/patterns that MUST NOT break
- Problematic cases likely to cause an error/bug

### 🏗️ Test structure

Test cases are written in spec files. Tests are tagged based on their execution time or other criteria. For example, you can use tags like `@fast` for quick tests and `@slow` for longer-running tests. Here is an example of the folder layout for testing the search engine and front-page of the `web` project:

```shell
web/                      (app name)
├── home-page.spec.ts     (feature name, kebab-case)
└── search.spec.ts
```

### 🗃️ Spec files

A spec file should have only one description (`test.describe`) of what part of an app is being tested. Therein can be one or more test cases (`test`) with a description of what scenario each test case is testing. Setup and tear down can be done in `test.beforeAll`, `test.beforeEach`, `test.afterAll`, and `test.afterEach`. You should not _rely_ on `after*` ever running, and you should prepare your environment every time _before_ each test. For example:

```jsx
test.describe('Overview part of banking app', () => {
  test.beforeAll(() => {
    // Create/clear database
    // Seed database
  })

  /* NOTE: there is no guarantee this will run */
  test.afterAll(() => {
    // Tear down database
    // Log out
  })

  test.beforeEach(() => {
    // Log in
    // Basic state reset, e.g. clear inbox
  })

  test('should get paid', { tag: '@slow' }, () => {
    // Make user get money using page.selector, page.click, etc.
    // Verify money is present
  })
})
```

Each test case (`test`) should test a specific scenario from end-to-end. If your test is getting long and complicated consider breaking it up within a `test` with `test.step`; each step will run in succession and the failure/success report is easier to read. Let’s take the operating licence application as an example; test various routes/cases:

- Hotel permit with food, but no alcohol
- Hotel permit with food and alcohol
- Bar with only alcohol
- Home accommodation (AirBnB style), no food, no alcohol

### 🧰 Using Fixtures and Mocking Server Responses

Fixtures are essential for setting up controlled test data to ensure predictable test behavior. Mocking server responses can help simulate specific backend scenarios without relying on live data. Use the following approach to mock server responses:

```typescript
await page.route('/api/endpoint', (route) =>
  route.fulfill({
    status: 200,
    body: JSON.stringify({ key: 'mockData' }),
  }),
)
```

### 😬 Tricky element searching

Some apps, like service-portal and application-system-form, load their components _very_ asynchronously. This can be an issue when targeting some elements, but they do not appear on the first page load, but instead load after the basic page has loaded.

In such cases you can wait for the elements to exist with `page.waitFor*` ([docs](https://playwright.dev/docs/api/class-page#page-wait-for-event)):

```jsx
// Wait for there to be at least 3 checkboxes
await page.waitForSelector(':nth-match("role=checkbox", 3')
// Wait for any arbitrary function
await page.waitForFunction(async () => {
  const timer = page.locator('role=timer')
  const timeLeft = await timer.textContent()
  return Number(timeLeft) < 10
})
```

## 🤖 Mockoon Usage Guide for E2E Tests

### ❓ What is Mockoon?

[Mockoon](https://mockoon.com/) is a tool for creating mock APIs, useful for simulating backend services during E2E testing.

### 📂 Opening and Creating Mock Files

- **To open an existing mock file**: Navigate to `apps/<app>/e2e/mocks/<app-mock>.json` in the Mockoon UI.
- **To create a new mock file**:
  1. Download [Mockoon](https://mockoon.com/download/).
  2. Create a new environment and save it to `apps/<app>/e2e/mocks/`.

### 🖥️ Running Mockoon Server with CLI

To start a mock server:

```bash
yarn mockoon-cli start --data ./apps/<app>/e2e/mocks/<app-mock>.json --port <port>
```

## 🛠️ Troubleshooting and FAQs

### 🔄 Common Issues

- **500: Internal Server Error**: If not related to your code, contact the DevOps team.
- **💀 ESOCKETTIMEDOUT**: Likely an infrastructure issue. Reach out to DevOps if persistent.
- **⌛ Tests Timing Out**: Increase the timeout if known network issues exist:

  ```typescript
  await page.goto('/my-url', { timeout: Timeout.medium })
  ```

## 📖 Additional Resources

- Refer to each app directory's `README.md` for app-specific details and usage instructions.
- Check out the [Playwright Documentation](https://playwright.dev) for further information.
