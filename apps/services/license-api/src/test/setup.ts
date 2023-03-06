import { Type } from '@nestjs/common'
import { TestApp, testServer, TestServerOptions } from '@island.is/testing/nest'

export let app: TestApp

export const setup = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
