import { testServer, TestServerOptions } from '@island.is/infra-nest-server'
import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { AppModule } from '../src/app/app.module'
import { GenericScope } from '@island.is/auth/scopes'
import { startMocking } from '@island.is/shared/mocking'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { handlers as temporaryVoterRegistryHandlers } from '../src/app/modules/endorsementMetadata/providers/temporaryVoterRegistry/mock/temporaryVoterRegistryMock'
import { handlers as nationalRegistryHandlers } from '../src/app/modules/endorsementMetadata/providers/nationalRegistry/mock/nationalRegistryMock'

export let app: INestApplication
let sequelize: Sequelize

// needed for generic error validation
expect.extend({
  anyOf(value: any, classTypes: any[]) {
    const types = classTypes.map((type) => type.name).join(', ')
    const message = `expected to be any of type: ${types}`
    for (let i = 0; i < classTypes.length; i++) {
      if (value.constructor === classTypes[i]) {
        return {
          pass: true,
          message: () => message,
        }
      }
    }

    return {
      pass: false,
      message: () => message,
    }
  },
})

export const setup = async (options?: Partial<TestServerOptions>) => {
  app = await testServer({
    appModule: AppModule,
    ...options,
  })
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  return app
}

interface SetupAuthInput {
  scope: GenericScope[]
  nationalId?: string
}
export const getAuthenticatedApp = ({
  scope,
  nationalId = '1234567890',
}: SetupAuthInput): Promise<INestApplication> =>
  setup({
    override: (builder) =>
      builder.overrideProvider(IdsUserGuard).useValue(
        new MockAuthGuard({
          nationalId,
          scope,
        }),
      ),
  })

let mockServer: any
beforeAll(() => {
  // Enable mocking.
  mockServer = startMocking([
    ...nationalRegistryHandlers,
    ...temporaryVoterRegistryHandlers,
  ])
})

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
    await mockServer.close()
  }
})
