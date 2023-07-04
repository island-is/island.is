import { User } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  testServer,
  useDatabase,
  useAuth,
  TestApp,
} from '@island.is/testing/nest'

import { AppModule } from '../src/app/app.module'
import { SequelizeConfigService } from '../src/sequelizeConfig.service'

interface SetupOptions {
  user?: User
}

export const setupWithAuth = ({
  user = createCurrentUser(),
}: SetupOptions = {}): Promise<TestApp> => {
  // Setup app with authentication and database
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })
}

export const setupWithoutAuth = async (): Promise<TestApp> =>
  testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })
}
