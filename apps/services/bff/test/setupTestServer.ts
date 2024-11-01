import { testServer, TestServerOptions } from '@island.is/testing/nest'
import { AppModule } from '../src/app/app.module'

export const setupTestServer = async (options?: Partial<TestServerOptions>) =>
  testServer({
    appModule: AppModule,
    ...options,
  })
