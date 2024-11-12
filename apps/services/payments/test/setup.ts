import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'
import { AppModule } from '../src/app/app.module'
import { SequelizeConfigService } from '../src/sequelizeConfig.service'

export const setupTestApp = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })

  return app
}
