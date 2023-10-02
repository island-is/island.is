# Testing Nest

This library is supposed to help developers setup a nest.js application for
testing purposes. The test server can work for unit-tests and/or
integration/functional tests by applying different hooks, like the
`useDatabase` hook.

## Test server

### Usage

`testServer` needs the project's `AppModule` to be passed as an argument in
order to build the Nest.js Application graph. From thereon you can build your
test nest server any way you want to hooks and overriders.

```typescript
const app: TestApp = await testServer({ appModule: AppModule })
```

The testServer can be setup anywhere, i.e. inside beforeAll, beforeEach, inside
the test, etc. Just remember to cleanUp the application afterwards by calling

```typescript
await app.cleanUp()
```

### Examples

In these examples we're going to assume that a 3rd party API is used which
needs mocking. This API is called `NationalRegistryApi`; and we're thus
creating a mock:

```typescript
class MockNationalRegistryApi {
  getUser() {
    return '1337'
  }
}
```

We'll be using One-Time setup by creating the testServer inside jest's
beforeAll setup block, and cleaning it up in the afterAll teardown block.

#### Unit test

For this test we want to override any extra dependencies that our
function/class is depending on in order to unit test it. These should be mocked
in `override`:

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

#### Functional (integration) test

For this test we want to hook up authentication with a currentUser and an
`sqlite` database in order to fully interact with the services:

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

As you can see in the Functional (integration) test above, we are using two
predefined hooks that we hook up to our test server. You can take a look at all
the predefined hooks in `libs/testing/nest/src/lib/hooks`.

### Examples

If you want to write a new hook (either custom or to be used by others) it
needs to follow this pattern:

```typescript
const myNewHook = (options) => {
  return {
    override: (builder) => {
      return builder.override* // perform the overrides
    },
    extend: (app) => {
      // extend the app with e.g. database/redis etc.
      const redis = app.resolve(Redis)
      // in order to cleanup the resources, you'll have to return a cleanup function:
      return () => {
        return redis.close()
      }
    }
  }
}
```

## Test fixtures

As you can see in the Functional (integration) test above, we are using a
CurrentUser test fixture from `@island.is/testing/fixtures`. The library
contains many more that can benefit you in creating random test data. Please
checkout `libs/testing/fixtures` to view available fixtures.
