import { TestingModuleBuilder } from '@nestjs/testing'

import {
  testServer,
  useDatabase,
  useAuth,
  TestApp,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  EinstaklingarApi,
  Einstaklingsupplysingar,
} from '@island.is/clients/national-registry-v2'
import {
  ApiScope,
  DelegationsService,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { AppModule } from '../src/app/app.module'
import { User } from '@island.is/auth-nest-tools'
import {
  createMockEinstaklingurApi,
  RskApiMock,
  FeatureFlagServiceMock,
} from './mocks'
import { createApiScope } from './fixtures'
import { RskApi } from '@island.is/clients/rsk/v2'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

interface SetupOptions {
  user: User
  userName: string
  nationalRegistryUser: Einstaklingsupplysingar
  scopes: string[]
}

export const setupWithAuth = async ({
  user,
  userName,
  nationalRegistryUser,
  scopes,
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  const app = await testServer<AppModule>({
    appModule: AppModule,
    override: (builder: TestingModuleBuilder) =>
      builder
        .overrideProvider(EinstaklingarApi)
        .useValue(createMockEinstaklingurApi(nationalRegistryUser))
        .overrideProvider(RskApi)
        .useValue(RskApiMock)
        .overrideProvider(FeatureFlagService)
        .useValue(FeatureFlagServiceMock),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  // Add scopes in the "system" to use for delegation setup
  const apiScopeModel = app.get<typeof ApiScope>('ApiScopeRepository')
  await apiScopeModel.bulkCreate([
    createApiScope({ name: scopes[0] }),
    createApiScope({ name: scopes[1] }),
  ])

  // Mock the name of the authentication user
  jest
    .spyOn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      app.get<DelegationsService>(DelegationsService) as any,
      'getUserName',
    )
    .mockImplementation(() => userName)

  return app
}

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer<AppModule>({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

  return app
}

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  const app = await testServer<AppModule>({
    appModule: AppModule,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  return app
}
