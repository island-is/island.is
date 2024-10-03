````markdown
# Testing Nest

This library helps developers set up a Nest.js application for testing purposes. The test server can work for unit tests and/or integration/functional tests by applying different hooks, like the `useDatabase` hook.

## Test Server

### Usage

`testServer` requires the project's `AppModule` to be passed as an argument to build the Nest.js application graph. From there, you can configure your test Nest server using hooks and overrides.

```typescript
const app: TestApp = await testServer({ appModule: AppModule })
```
````

The `testServer` can be set up anywhere, i.e., inside `beforeAll`, `beforeEach`, inside the test, etc. Just remember to clean up the application afterward by calling:

```typescript
await app.cleanUp()
```

### Examples

In these examples, we will assume the use of a third-party API called `NationalRegistryApi`, which requires mocking. We will create a mock for the API:

```typescript
class MockNationalRegistryApi {
  getUser() {
    return '1337'
  }
}
```

We'll use one-time setup by creating the `testServer` inside Jest's `beforeAll` setup block and cleaning it up in the `afterAll` teardown block.

#### Unit Test

For this test, we want to override any extra dependencies that our function/class depends on to unit test it. These should be mocked in `override`:

```typescript
import { TestApp, testServer } from '@island.is/testing/nest';

describe('Example unit test', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      override: (builder: TestingModuleBuilder) =>
        builder
          .overrideProvider(NationalRegistryApi)
          .useValue(new MockNationalRegistryApi()),
    });
  });

  afterAll(async () => {
    await app.cleanUp();
  });
```

#### Functional (Integration) Test

For this test, we want to hook up authentication with a `currentUser` and an `sqlite` database to fully interact with the services:

```typescript
import { TestApp, testServer } from '@island.is/testing/nest';
import { createCurrentUser } from '@island.is/testing/fixtures';

const currentUser = createCurrentUser();

describe('Example functional test', () => {
  let app: TestApp;

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      override: (builder: TestingModuleBuilder) =>
        builder
          .overrideProvider(NationalRegistryApi)
          .useValue(new MockNationalRegistryApi()),
      hooks: [
        useAuth({ currentUser }),
        useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
      ],
    });
  });

  afterAll(async () => {
    await app.cleanUp();
  });
```

## Hooks

As seen in the functional (integration) test above, we use predefined hooks connected to our test server. You can explore all predefined hooks in `libs/testing/nest/src/lib/hooks`.

### Examples

To write a new hook (either custom or for others to use), it needs to follow this pattern:

```typescript
const myNewHook = (options) => {
  return {
    override: (builder) => {
      return builder.override*; // perform the overrides
    },
    extend: (app) => {
      // Extend the app with, e.g., database/redis.
      const redis = app.resolve(Redis);
      // To clean up resources, return a cleanup function:
      return () => {
        return redis.close();
      };
    },
  };
};
```

## Test Fixtures

As seen in the functional (integration) test above, we use a `CurrentUser` test fixture from `@island.is/testing/fixtures`. The library contains many more fixtures that can help create random test data. Please check `libs/testing/fixtures` to view available fixtures.

```

```
