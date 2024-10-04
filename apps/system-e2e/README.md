# System Testing

Welcome to testing. Each section includes a TL;DR for quick guidance.

## Test environment

System smoke tests run against our live [dev web](https://beta.dev01.devland.is/) on every commit to `main`. Changes on the dev web impact these tests. Use `disablers.disable*` and `urls.icelandicAndNoPopup` for issues like locale changes. These will be replaced by Mountebank and test servers.

System acceptance tests run daily in isolated environments but require manual initiation currently.

## 🏃 Running tests

To test an app/project, start the app and use Playwright for testing.

⚡ TL;DR:

- Install Playwright: `yarn install && yarn codegen && yarn playwright install`
- Start the app: `yarn dev-init <app> && yarn dev <app>`
- Test the app: `yarn system-e2e <app-name>`

### 👨‍🍳 Prepare the app

For development and testing, initiate your app:

1. `yarn get-secrets <app>`
2. `yarn dev-init <app>`
3. `yarn dev <app>`

Example for `application-system-form`:

1. `yarn get-secrets application-system-form`
2. `yarn dev-init application-system-form`
3. `yarn dev application-system-form`

For unsupported projects, check the `README.md` or contact QA.

### 🤖 Start Playwright

First-time setup requires `yarn playwright install`. Use `--list` to list tests or run them via:

- Playwright directly: `yarn playwright test -c apps/system-e2e '<app>/.*/<smoke|acceptance>'`
- Specific file: `yarn system-e2e '<path/to/test/file>'`
- Regex pattern: `yarn system-e2e '<pattern>'`

Example patterns:

- Smoke: `yarn system-e2e 'application-system-form/smoke'`
- Acceptance: `yarn system-e2e 'service-portal/acceptance'`
- Both: `yarn system-e2e 'system-e2e/.*/web'`

Run `export TEST_ENVIRONMENT=dev` before commands to test the live [dev web](https://beta.dev01.devland.is/). Credentials needed; ask DevOps. Options: `local`, `dev`, `staging`, `prod`.

## ✍️ Writing tests

⚡ TL;DR: Run `yarn playwright codegen <app-url> --output <path/to/spec.ts>`, then refine the output. Adjust selectors to use roles or `data-testid` attributes for stability.

### 🤔 What to test

Avoid exhaustive testing. Focus on:

- Common usage patterns
- Critical features that shouldn't break
- Likely problem areas

### 🏗️ Test structure

Spec files should include smoke tests (basic verification) and acceptance tests (detailed, with changes). Organize by app and test type:

```text
web/                      (app name)
├── smoke/                (test type)
│   └── home-page.spec.ts (feature)
└── acceptance/
    └── search.spec.ts
```

### 🗃️ Spec files

Each spec should have one `test.describe` for the app part. Use `test` for scenarios, `test.beforeAll`, and `test.afterAll` for setup/teardown. Ensure each test can run independently with `beforeEach`:

```javascript
test.describe('Overview of banking app', () => {
  test.beforeAll(() => {
    // Set up database
  })

  test('should get paid', () => {
    // Implement test actions
  })
})
```

Each test should be succinct, considering `test.step` for clarity.

### 🧰 Using fixtures

Fixtures standardize mocked data, found in `src/fixtures/<app>.ts`. Use JSON or TypeScript objects.

### ☕ Mocking server-responses

Use `page.route` to mock server responses. Example for simulating an error:

```javascript
await page.route('/api/graphql?op=userProfile', (route) =>
  route.fulfill({
    status: 403,
    path: '../../../fixtures/<app>/myError.json',
  }),
)
```

Refer to [Playwright docs](https://playwright.dev/docs/api/class-route#route-fulfill) for more.

### 😬 Tricky element searching

Handle asynchronous elements with `page.waitFor*`:

```javascript
await page.waitForSelector(':nth-match("role=checkbox", 3)')
```

### 🎩 Testing with Mountebank

#### Setup

- Add `setup-xroad.mocks.ts` in `/acceptance`.
- Activate mocks in your tests with `await setupXroadMocks()`.

#### Running the test

- In `/infra`, run `yarn cli render-local-env --service=<services>`.
- Copy and execute Docker output.
- Adjust service ports and start services.
- Run tests with Playwright.

## 🙋 Troubleshooting/FAQ

### 🫀 500: Internal Server Error

Debug if it's your code. Otherwise, it's unknown.

### 💀 Error: ESOCKETTIMEDOUT

If it persists, contact DevOps.

### ⌛ Tests are timing out

This could be a network or performance issue. Increase timeouts if necessary:

```javascript
page.goto('/my-url', { timeout: Timeout.medium })
```
