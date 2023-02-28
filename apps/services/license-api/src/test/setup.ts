import { Type } from '@nestjs/common'
import { TestApp, testServer, TestServerOptions } from '@island.is/testing/nest'

// Give jest a bit more time when running application-system tests. Jest lazily transforms dynamically imported files.
// In this case, we're using ts-jest (which is slow) and the application system uses dynamic imports for some large
// application templates. So the first time a test imports a large template, it stalls while jest starts transforming
// the template files. Note that jest has a cache for these transforms, so this is mainly an issue on a cold run.
//
// Going forward, the plan is to replace ts-jest with babel-jest, esbuild-jest or swc-jest. We just need to get them
// working correctly with our typescript, decorators and type hints.
jest.setTimeout(10000)

export let app: TestApp

export const setup = (
  module: Type<any>,
  options?: Partial<TestServerOptions>,
) => {
  return testServer({
    appModule: module,
    ...options,
  })
}

afterAll(async () => {
  if (app) {
    app.cleanUp()
  }
})
