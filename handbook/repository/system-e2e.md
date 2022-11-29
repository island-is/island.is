# Testing

Welcome to testing. Jump to the section you need below.

# 🏃 Running tests

When testing an app/project you need to first start the app, then test it with Playwright.

## ⚡ TL;DR

- Start the application: `yarn dev-init <app> && yarn dev <app>`
- Test the app: `yarn playwright menu --e2e --project <path/to/your/app>`

## 👨‍🍳 Prepare the app

For local development and testing start your app. Generally, first-time setup and running is simply:

1. `yarn get-secrets <app>`
2. `yarn dev-init <app>`
3. `yarn dev <app>`

However, not all projects support this, or are incomplete in this setup. If this fails, find its `README.md` and follow the instructions given there. If that fails, reach out to the QA team and we’ll remedy the documentation and improve the initial setup.

## 🤖 Start Playwright

First time you run Playwright, you'll need to set up its runtime environment with `yarn playwright install`. Then, Playwright can be started in several ways:

- Using our local script: `./scripts/local-e2e.sh --help`
- Using playwright directly: `yarn playwright test --project <path/to/your/app>`

{% hint style="info" %}
Add `export TEST_ENVIRONMENT=dev` before any command to test against the live [dev-web](https://beta.dev01.devland.is/). Valid values are `local` (default), `dev`, `staging`, and `prod` to test the respective environment.
{% endhint %}

{% hint style="info" %}
You can append to the `test` command the path/name of your test case `yarn playwright test <path/to/spec/file>` to only test a specific spec.
{% endhint %}

# ✍️ Writing tests

## ⚡ TL;DR

Copy to `apps/system-e2e/src/integration/<your-app>/acceptance/<thing-you-are-testing>.spec.ts` and modify:

```jsx
import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/service-portal/users.json'
import { Timeout } from '../../../lib/types'
import { test, expect, type, Page } from '@playwright/test'

test.describe('Thing you are testing', ({ page }) => {
  const fakeUser = getFakeUser(fakeUsers, 'Gervimaður Fornlönd')
  test.beforeEach(() => {
    await idsLogin({ phoneNumber: fakeUser.phoneNumber })
    await page.goto('/your/app-slug')
    wait(Timeout.short)
  })

  test('specific scenario describing what is tested', ({ page }) => {
		await page.locator('button[role="start"]').click()
    await expect(page).toHaveUrl('/my-redirect')
    page.locator('input[name="allergies"]').fill('tree nuts, crowds')
    page.locator('input[type="checkbox"]')
			.filter({ has: page.locator('my-attribute') })
			.evaluateAll((box) => {
				expect(box).toHaveAttribute('checked', 'true')
			})
		expect(page.locator('my-popup')).toContainText('Success')
		await page.waitForSelector(page.locator(':nth-match(item, 3)'))
  })
})
```

Copy to `apps/system-e2e/src/fixtures/<your-app>/users.json` and modify:

```jsx
;[
  {
    name: 'Gervimaður Fornlönd',
    phoneNumber: '0109999',
    nationalId: '0101309999',
    role: 'user',
  },
]
```

## 🤔 What to test

Writing tests for every possible combination is time-consuming for you and the CI pipeline, with diminishing value beyond the most common cases.

You should therefore aim to write test for:

- Most common usage patterns
- Usage/patterns that MUST NOT break
- Problematic cases likely to cause an error/bug

## 🏗️ Test structure

Test cases are written spec files somewhere. Tests that do not modify anything (e.g. _create_ an application, _change_ the user’s name, etc.), and verify basic functionality are called **smoke tests**. Tests that are more detailed and/or make any changes at all, are called **acceptance tests**. Test cases are put into folders by what app they are testing, smoke/acceptance test, and each file tests some aspect of an app. Here is an example of the folder layout for testing the search engine and front-page of the `web` project:

```bash
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
  test.beforeEach(() => {
    // Log in
    // Basic state reset, e.g. clear inbox
  })

  test('should get paid', () => {
    // Make user get money using page.selector, page.click, etc.
    // Verify money is present
  })

  /** NOTE: there is no guarantee this will run */
  test.afterAll(() => {
    // Tear down database
    // Log out
  })
})
```

Each test case (`test`) should test a specific scenario from end-to-end. Let’s take the operating licence application as an example. To test various routes/cases your test cases might include:

- Hotel permit with food, but no alcohol
- Hotel permit with food and alcohol
- Bar with only alcohol
- Home accommodation (AirBnB style), no food, no alcohol

## 🧰 Using fixtures

Fixtures are objects to use instead of real data when mocking something. You can use a fixture user to standardize between test cases in a spec. You can also define fixtures for static responses to use in `page.route` for more control over how you want the server to respond.

Fixtures are located in `src/fixtures/<your-app>/<object-type>.json`. Currently, fixtures and `page.route`s are only relevant in the front-end app. Getting the back-end to use specific fixtures is a Work in Progress.

Fixtures can be any JSON object (in `.json` files) or a typed TypeScript object (in `.ts` files). If writing a typed object, place new types in `lib/types.ts`.

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

In such cases you can wait for the elements to exist with `page.waitFor*`:

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

# 🙋 Troubleshooting/FAQ

## 🫀 500: Internal Server Error

A 500 error can occur randomly. If the error is coming from your app or code you worked on, you have earned yourself a debug day. If the error is not from your code, ignore it for now. We do not know what’s going on 🤷

## 💀 Error: ESOCKETTIMEDOUT

This is an infrastructure issue and should have been resolved. If you see this in your tests on dev, contact devops 👩‍💻

## ⌛ Tests are timing out

This indicates either a local network issue like bad internet (your problem), or a performance problem in the application code. In some cases this can be remedied by increasing the timeout if a certain site/service is known to be slow with `page.goto('/my-url', { timeout: Timeout.medium })`.
