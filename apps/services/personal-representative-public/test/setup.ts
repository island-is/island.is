import { AppModule } from '../src/app/app.module'
import {
  testServer,
  useDatabase,
  TestApp,
  useAuth,
} from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'

interface SetupOptions {
  user: User
}

// needed for generic error validation
expect.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const setupWithAuth = async ({
  user,
}: SetupOptions): Promise<TestApp> => {
  user.nationalId
  const app = await testServer({
    appModule: AppModule,
    override: (builder) =>
      builder.overrideProvider(IdsUserGuard).useValue(
        new MockAuthGuard({
          nationalId: user.nationalId,
          scope: user.scope,
        }),
      ),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  return app
}

export const setupWithoutScope = async (): Promise<TestApp> => {
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

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

  return app
}
