# Testing Nest

This library helps developers set up a Nest.js application for testing. The test server can be used for unit or integration/functional tests by applying different hooks, such as the `useDatabase` hook.

## Test Server

### Usage

`testServer` requires the project's `AppModule` to build the Nest.js Application graph. Configure your test server with desired hooks and overrides.

```typescript
const app: TestApp = await testServer({ appModule: AppModule })
```

Set up `testServer` in `beforeAll`, `beforeEach`, or within a test. Remember to clean up by calling:

```typescript
await app.cleanUp()
```

### Examples

Assume we need to mock a 3rd party API: `NationalRegistryApi`. Create a mock:

```typescript
class MockNationalRegistryApi {
  getUser() {
    return '1337'
  }
}
```

Use One-Time setup with Jest's `beforeAll` and teardown with `afterAll`.

#### Unit Test

Override dependencies that need mocking in `override`:

```typescript
import { TestApp, testServer } from '@island.is/testing/nest'

describe('Example unit test', () => {
  let app: TestApp

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      override: (builder: TestingModuleBuilder) =>
        builder
          .overrideProvider(NationalRegistryApi)
          .useValue(new MockNationalRegistryApi()),
    })
  }

  afterAll(async () => {
    await app.cleanUp()
  })
```

#### Functional (Integration) Test

Hook up authentication with `currentUser` and an `sqlite` database:

```typescript
import { TestApp, testServer } from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'

const currentUser = createCurrentUser()

describe('Example functional test', () => {
  let app: TestApp

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
    })
  }

  afterAll(async () => {
    await app.cleanUp()
  })
```

## Hooks

In the functional (integration) test, two predefined hooks are used. View all predefined hooks at `libs/testing/nest/src/lib/hooks`.

### Examples

To write a new hook, follow this pattern:

```typescript
const myNewHook = (options) => {
  return {
    override: (builder) => {
      return builder.override* // perform the overrides
    },
    extend: (app) => {
      // extend the app with resources like a database or Redis
      const redis = app.resolve(Redis)
      // return a cleanup function
      return () => {
        return redis.close()
      }
    }
  }
}
```

## Test Fixtures

In the functional (integration) test, a `CurrentUser` test fixture from `@island.is/testing/fixtures` is used. The library contains more fixtures for creating random test data. Refer to `libs/testing/fixtures` for available fixtures.