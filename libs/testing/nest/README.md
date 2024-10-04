# Testing Nest

This library aids in setting up a Nest.js application for testing, supporting unit or integration/functional tests with various hooks, like `useDatabase`.

## Test Server

### Usage

`testServer` needs the project's `AppModule` to configure the Nest.js application graph. Set up your test server with desired hooks and overrides:

```typescript
const app: TestApp = await testServer({ appModule: AppModule })
```

Initialize `testServer` in `beforeAll`, `beforeEach`, or within a test. Clean up with:

```typescript
await app.cleanUp()
```

### Examples

To mock a 3rd party API, e.g., `NationalRegistryApi`, create a mock class:

```typescript
class MockNationalRegistryApi {
  getUser() {
    return '1337'
  }
}
```

Use Jest's `beforeAll` for setup and `afterAll` for teardown.

#### Unit Test

Override necessary dependencies:

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
})
```

#### Functional (Integration) Test

Integrate authentication with `currentUser` and an `sqlite` database:

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
})
```

## Hooks

In the integration test, two predefined hooks are shown. Explore all hooks in `libs/testing/nest/src/lib/hooks`.

### Example

To create a new hook, use this structure:

```typescript
const myNewHook = (options) => {
  return {
    override: (builder) => {
      return builder.override* // perform the overrides
    },
    extend: (app) => {
      // extend app resources like a database or Redis
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

In the integration test, a `CurrentUser` fixture from `@island.is/testing/fixtures` is used. The library offers more fixtures for random test data. See `libs/testing/fixtures` for details.

