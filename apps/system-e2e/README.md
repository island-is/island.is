```markdown
# System Testing

Welcome to testing. For your convenience, each section has a TL;DR, so you can quickly get started.

## Test Environment

System smoke tests are run against our live [dev web](https://beta.dev01.devland.is/) on every commit to `main`. This means changes on the dev web will be reflected in the system tests. For example, if you change a user's preferred locale, your test will break if it's not language-agnostic. To address this, we have implemented `disablers.disable*` and `urls.icelandicAndNoPopup`. We plan to phase these out for mocking with Mountebank and test servers.

System acceptance tests run in their own isolated dev environment daily. We haven't yet implemented running these tests regularly, and they require a manual start for now.

# 🏃 Running Tests

When testing an app/project, you need to first start the app, then test it with Playwright.

## ⚡ TL;DR

- Set up Playwright: `yarn install && yarn codegen && yarn playwright install`
- Start the application: `yarn dev-init <app> && yarn dev <app>`
- Test the app: `yarn system-e2e <name-of-your-app>`

## 👨‍🍳 Prepare the App

For local development and testing, start your app. Generally, the first-time setup and running are simply:

1. `yarn get-secrets <app>`
2. `yarn dev-init <app>`
3. `yarn dev <app>`

{% hint style="example" %}
1. `yarn get-secrets application-system-form`
2. `yarn dev-init application-system-form`
3. `yarn dev application-system-form`
{% endhint %}

However, not all projects support this or have incomplete setups. If this fails, check its `README.md` and follow the instructions. If that fails, contact the QA team to remedy the documentation and improve the initial setup.

## 🤖 Start Playwright

The first time you run Playwright, you'll need to set up its runtime environment with `yarn playwright install`. Then, you can list tests with the `--list` flag or run tests in various ways:

- Using Playwright directly: `yarn playwright test -c apps/system-e2e '<name-of-your-app>/.*/<smoke|acceptance>'`
- Specific test file: `yarn system-e2e '<path/to/your/test/file>'`
- Using a path pattern (regex): `yarn system-e2e '<pattern>'`

{% hint style="example" %}
- smoke: `yarn system-e2e 'application-system-form/smoke'`
- acceptance: `yarn system-e2e 'service-portal/acceptance'`
- both: `yarn system-e2e 'system-e2e/.*/web'`
- pattern: `yarn system-e2e 'system-e2e/.*/s?port?'`

Note that the pattern is a RegEx string in quotes.
{% endhint %}

{% hint style="info" %}
Run `export TEST_ENVIRONMENT=dev` before any command to test against the live [dev web](https://beta.dev01.devland.is/). Note that you'll need Cognito username/password credentials (ask DevOps for access). Valid values are `local` (default), `dev`, `staging`, and `prod` to test the respective environment.
{% endhint %}

# ✍️ Writing Tests

## ⚡ TL;DR

Run `yarn playwright codegen <url-to-your-app> --output <path/to/your/app/spec.ts>` and modify the output. Selectors need special attention; they should be transformed to use roles or `data-testid` attributes for stability (see below for how to).

## 🤔 What to Test

Writing tests for every possible combination is time-consuming and offers diminishing value beyond the most common scenarios. Focus on tests for:

- Most common usage patterns
- Usage/patterns that MUST NOT break
- Problematic cases likely to cause an error/bug

## 🏗️ Test Structure

Test cases are written in spec files. Tests that do not modify anything (e.g., _create_ an application, _change_ the user's name, etc.), and verify basic functionality are called **smoke tests**. Tests that are more detailed and/or make any changes are called **acceptance tests**. Test cases are organized by app, test type (smoke/acceptance), and feature.

Example folder layout for testing:

```shell
web/                      (app name)
├── smoke/                (test type)
│   └── home-page.spec.ts (feature name, kebab-case)
└── acceptance/
    └── search.spec.ts
```

## 🗃️ Spec Files

A spec file should have only one description (`test.describe`) of what part of an app is being tested. Therein can be one or more test cases (`test`) with descriptions of each scenario. Setup and teardown can be done in `test.beforeAll`, `test.beforeEach`, `test.afterAll`, and `test.afterEach`. 

Example:

```javascript
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
    // Basic state reset, e.g., clear inbox
  })

  test('should get paid', () => {
    // Make user get money using page.selector, page.click, etc.
    // Verify money is present
  })
})
```

Each test case (`test`) should test a specific scenario from end-to-end. If your test is complex, consider using `test.step` to break it up for clearer reports. For example, test various routes/cases for an application:

- Hotel permit with food, but no alcohol
- Hotel permit with food and alcohol
- Bar with only alcohol
- Home accommodation (AirBnB style), no food, no alcohol

## 🧰 Using Fixtures

Fixtures are objects to use instead of real data when mocking something. Use fixture users to standardize between test cases in a spec. Fixtures for static responses can be used in `page.route` for tailored server responses. Full docs at [Playwright.dev](https://playwright.dev/docs/test-fixtures).

Fixtures are located in `src/fixtures/<your-app>.ts`. While primarily relevant for front-end apps, getting the back-end to use specific fixtures is a Work in Progress.

Fixtures can be JSON or typed TypeScript objects.

## ☕ Mocking Server-Responses

Use `page.route` to catch back-end calls and modify request/response or return custom data.

Example to simulate a GraphQL error:

```javascript
// ...
test('should handle error gracefully', async ({ page }) => {
  // Make any call to this URL return a custom error
  await page.route('/api/graphql?op=userProfile', (route) =>
    route.fulfill({
      status: 403,
      path: '../../../fixtures/<my-app>/myError.json',
    }),
  )
  await page.locator('role=button[type="submit"]').click()
  await expect(page.locator('role=error')).toHaveText(
    'There was an error, continue anyways?',
  )
})
```

Refer to the [official Playwright documentation](https://playwright.dev/docs/api/class-route#route-fulfill) for detailed usage.

## 😬 Tricky Element Searching

Some apps load components asynchronously. Use `page.waitFor*` ([docs](https://playwright.dev/docs/api/class-page#page-wait-for-event)) to handle this:

```javascript
// Wait for at least 3 checkboxes
await page.waitForSelector(':nth-match("role=checkbox", 3)')
// Wait for an arbitrary function
await page.waitForFunction(async () => {
  const timer = page.locator('role=timer')
  const timeLeft = await counter.textContent()
  return Number(timeLeft) < 10
})
```

## 🎩 Testing with Mountebank

To mock your API response, use Mountebank.

### Setup

To set up your test with Mountebank:

- Add a `setup-xroad.mocks.ts` file to your `/acceptance` folder.
- Replicate the response from the service you are mocking. See examples in `apps/system-e2e/src/tests/islandis/service-portal/acceptance/setup-xroad.mocks.ts`.
- Activate the mocking process with `await setupXroadMocks()` in your test file, as exemplified in `apps/system-e2e/src/tests/islandis/service-portal/acceptance/assets.spec.ts`.

### Running the Test

To run your tests with Mountebank:

1. Navigate to `/infra`.
2. Run `yarn cli render-local-env --service=service-portal --service=api`, replace with your target services.
3. Run the provided Docker command from your terminal, e.g., `docker run -it --rm -p ...`.
4. Start your services, ensuring their ports match Mountebank’s. For example, `XROAD_BASE_PATH=http://localhost:9388 yarn start api`.
5. Run the Playwright test.

# 🙋 Troubleshooting/FAQ

## 🫀 500: Internal Server Error

This can occur randomly. If the error originates from your app or code, you'll need to debug. Otherwise, it can be ignored for now.

## 💀 Error: ESOCKETTIMEDOUT

This is an infrastructure issue. If it appears in your dev tests, contact DevOps.

## ⌛ Tests are Timing Out

This may indicate local network issues or application performance problems. It can sometimes be mitigated by increasing the timeout with `page.goto('/my-url', { timeout: Timeout.medium })`.
```