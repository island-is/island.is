import { TestingModuleBuilder } from '@nestjs/testing'

import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { IdsUserGuard, MockAuthGuard, User } from '@island.is/auth-nest-tools'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  TestApp,
  testServer,
  useAuth,
  useDatabase,
} from '@island.is/testing/nest'

import { AppModule } from '../src/app/app.module'

class mockEinstaklingarApi {
  withMiddleware = () => this
  einstaklingarGetEinstaklingur = () => Promise.resolve({})
  einstaklingarGetForsja = () => []
}

interface SetupOptions {
  user: User
}

export const setupWithAuth = async ({
  user,
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  const app = await testServer({
    appModule: AppModule,
    override: (builder: TestingModuleBuilder) =>
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId: user.nationalId,
            scope: user.scope,
          }),
        )
        .overrideProvider(EinstaklingarApi)
        .useClass(mockEinstaklingarApi)
        .overrideProvider(RskProcuringClient)
        .useValue({
          getSimple: () => Promise.resolve(null),
        })
        .overrideProvider(FeatureFlagService)
        .useValue({ getValue: () => true }),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  return app
}

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

  return app
}

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  const app = await testServer({
    appModule: AppModule,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  return app
}
