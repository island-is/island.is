import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import {
  TestApp,
  testServer,
  TestServerOptions,
  truncate,
  useBullQueue,
  useDatabase,
} from '@island.is/testing/nest'
import { SequelizeConfigService } from '../src/app/sequelizeConfig.service'

// Give jest a bit more time when running application-system tests. Jest lazily transforms dynamically imported files.
// In this case, we're using ts-jest (which is slow) and the application system uses dynamic imports for some large
// application templates. So the first time a test imports a large template, it stalls while jest starts transforming
// the template files. Note that jest has a cache for these transforms, so this is mainly an issue on a cold run.
//
// Going forward, the plan is to replace ts-jest with babel-jest, esbuild-jest or swc-jest. We just need to get them
// working correctly with our typescript, decorators and type hints.
jest.setTimeout(10000)

export let app: TestApp
let sequelize: Sequelize

export const setup = async (
  module: Type<any>,
  options?: Partial<TestServerOptions>,
) => {
  app = await testServer({
    appModule: module,
    hooks: [
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      useBullQueue({ name: 'upload' }),
    ],
    ...options,
  })
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  return app
}

beforeEach(() => truncate(sequelize))

afterAll(async () => {
  if (app) {
    app.cleanUp()
  }
})
