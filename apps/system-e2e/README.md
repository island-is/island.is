# System Testing

Welcome to testing. For your convenience each section has a TL;DR, so you can quickly get started.

## Test environment

System smoke tests are run against our live [dev web](https://beta.dev01.devland.is/), on every commit to `main`.
This means that changes done on the dev web will be reflected in the system tests.
E.g. if you change a users preferred locale, your test will break if it's not language-agnostic.
To combat this we have implemented `disablers.disable*` and `urls.icelandicAndNoPopup`.
We plan on phasing these out for mocking with Mountebank and test servers.

System acceptance tests will be running in their own isolated dev-environment, daily.
We haven't yet implemented running these tests regularly, and require manual start, for now.

# 🏃 Running tests

When testing an app/project you need to first start the app, then test it with Playwright.

## ⚡ TL;DR

- Set up Playwright: `yarn install && yarn codegen && yarn playwright install`
- Start the application: `yarn dev-init <app> && yarn dev <app>`
- Test the app: `yarn system-e2e <name-of-your-app>`

## 👨‍🍳 Prepare the app

For local development and testing start your app. Generally, first-time setup and running is simply:

1. `yarn get-secrets <app>`
2. `yarn dev-init <app>`
3. `yarn dev <app>`

{% hint style="example" %}

1. `yarn get-secrets application-system-form`
2. `yarn dev-init application-system-form`
3. `yarn dev application-system-form`

{% endhint %}

However, not all projects support this, or are incomplete in this setup. If this fails, find its `README.md` and follow the instructions given there. If that fails, reach out to the QA team and we’ll remedy the documentation and improve the initial setup.

## 🤖 Start Playwright

First time you run Playwright, you'll need to set up its runtime environment with `yarn playwright install`. Then, you can list tests with the `--list` flag or run tests in various ways:

- Using playwright directly: `yarn playwright test -c apps/system-e2e '<name-of-your-app>/.*/<smoke|acceptance>'`
- Specific test file: `yarn system-e2e '<path/to/your/test/file>'`
- Using a path pattern (regex): `yarn system-e2e '<pattern>'`

{% hint style="example" %}

- smoke: `yarn system-e2e 'application-system-form/smoke'`
- acceptance: `yarn system-e2e 'service-portal/acceptance'`
- both: `yarn system-e2e 'system-e2e/.*/web'`
- pattern `yarn system-e2e 'system-e2e/.*/s?port?'`

Note that the pattern is a RegEx string in quotes.
{% endhint %}

{% hint style="info" %}
Run `export TEST_ENVIRONMENT=dev` before any command to test against the live [dev web](https://beta.dev01.devland.is/). Note that you'll need Cognito username/password credentials for this (ask DevOps for access). Valid values are `local` (default), `dev`, `staging`, and `prod` to test the respective environment.
{% endhint %}

# ✍️ Writing tests

## ⚡ TL;DR

Run `yarn playwright codegen <url-to-your-app> --output <path/to/your/app/spec.ts>` and modify the output. The selectors need special attention; they should be transformed to use roles or `data-testid` attributes for stability (see below on how to).

## 🤔 What to test

Writing tests for every possible combination is time-consuming for you and the CI pipeline, with diminishing value beyond the most common cases.

You should therefore aim to write test for:

- Most common usage patterns
- Usage/patterns that MUST NOT break
- Problematic cases likely to cause an error/bug

## 🏗️ Test structure

Test cases are written spec files. Tests that do not modify anything (e.g. _create_ an application, _change_ the user’s name, etc.), and verify basic functionality are called **smoke tests**. Tests that are more detailed and/or make any changes at all, are called **acceptance tests**. Test cases are put into folders by what app they are testing, smoke/acceptance test, and each file tests some aspect of an app. Here is an example of the folder layout for testing the search engine and front-page of the `web` project (within the system-e2e app):

```shell
web/                      (app name)
├── smoke/                (test type)
│   └── home-page.spec.ts (feature name, kebab-case)
└── acceptance/
    └── search.spec.ts
```

## 🗃️ Spec files

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

  test('should get paid', () => {
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

## 🧰 Using fixtures

Fixtures are objects to use instead of real data when mocking something. You can use a fixture user to standardize between test cases in a spec. You can also define fixtures for static responses to use in `page.route` for more control over how you want the server to respond. Full docs at [Playwright.dev](https://playwright.dev/docs/test-fixtures).

Fixtures are located in `src/fixtures/<your-app>.ts`. Currently, fixtures and `page.route`s are only relevant in the front-end app. Getting the back-end to use specific fixtures is a Work in Progress (see [PR](https://github.com/island-is/island.is/pull/8862)).

Fixtures can be any JSON object (in `.json` files) or – preferably – a typed TypeScript object (in `.ts` files).

## ☕ Mocking server-responses

If you want to mock a scenario where the back-end returns a specific object/reply, you can use `page.route` to catch the back-end call and either modify the request/response or return something custom.

For example, if you want to simulate a GraphQL error from user-profile you could add the following to your test case (`test(...)`) or `test.beforeAll`/`test.beforeEach`:

```jsx
// ...
test('should handle error gracefully', async ({ page }) => {
  // Make any call to this url return my custom error
  await page.route('/api/graphql?op=userProfile', (route) =>
    route.fulfill({
      status: 403,
      path: '../../../fixtures/<my-app>/myError.json',
    }),
  )
  await page.locator('role=button[type="submit"]').click()
  expect(page.locator('role=error')).toHaveText(
    'There was an error, continue anyways?',
  )
})
```

Check out the [official playwright documentation](https://playwright.dev/docs/api/class-route#route-fulfill) on stubbing/intercepting for greater detail and more advanced usage.

## 😬 Tricky element searching

Some apps, like service-portal and application-system-form, load their components _very_ asynchronously. This can be an issue when targeting some elements, but they do not appear on the first page load, but instead load after the basic page has loaded.

In such cases you can wait for the elements to exist with `page.waitFor*` ([docs](https://playwright.dev/docs/api/class-page#page-wait-for-event)):

```jsx
// Wait for there to be at least 3 checkboxes
await page.waitForSelector(':nth-match("role=checkbox", 3')
// Wait for any arbitrary function
await page.waitForFunction(async () => {
  const timer = page.locator('role=timer')
  const timeLeft = await counter.textContent()
  return Number(timeLeft) < 10
})
```

## 🎩 Testing with Mountebank

If you want to mock your API response, you can do that with mountebank.

### Setup

You will need a few things to set up your test so it can run with mountebank.

- Add a `setup-xroad.mocks.ts` file to your `/acceptance` folder.
- Within `setup-xroad.mocks.ts` you will be replicating the response from the service you are mocking. Examples of this setup can be found in `apps/system-e2e/src/tests/islandis/service-portal/acceptance/setup-xroad.mocks.ts` and `apps/system-e2e/src/tests/islandis/application-system/acceptance/setup-xroad.mocks.ts`
- Within your test file you will need something to activate the mocking process. That would be `await setupXroadMocks()` placed within `test('', async () => {`. Example within `apps/system-e2e/src/tests/islandis/service-portal/acceptance/assets.spec.ts`

### Running the test

Now that you are set up. You need to run a couple of commands.

- Navigate to `/infra`
- In your terminal run `yarn cli render-local-env --service=service-portal --service=api` .
  - This would show you commands how to start the mocking for `service-portal` and `api`. Replace with the services you want to test.
- In the output you will see a docker output it will look something like this: `docker run -it --rm -p ...` copy that line and run in a new terminal window. Now your Mountebank impostor should be running.
- Open a new terminal tab within the island.is root.
- Now start your services, but make sure your services ports have been replaced by the ports provided by Mountebank. In this examples case that would be `XROAD_BASE_PATH=http://localhost:9388 yarn start api`
- Run the test with Playwright and you should see your mocked data replace the API's data.

# 🙋 Troubleshooting/FAQ

## 🫀 500: Internal Server Error

A 500 error can occur randomly. If the error is coming from your app or code you worked on, you have earned yourself a debug day. If the error is not from your code, ignore it for now. We do not know what’s going on 🤷

## 💀 Error: ESOCKETTIMEDOUT

This is an infrastructure issue and should have been resolved. If you see this in your tests on dev, contact devops 👩‍💻

## ⌛ Tests are timing out

This indicates either a local network issue like bad internet (your problem), or a performance problem in the application code. In some cases this can be remedied by increasing the timeout if a certain site/service is known to be slow with `page.goto('/my-url', { timeout: Timeout.medium })`.
