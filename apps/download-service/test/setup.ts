import { testServer, TestServerOptions } from '@island.is/testing/nest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app/app.module'

export let app: INestApplication

export const setup = async (options?: Partial<TestServerOptions>) => {
  return await testServer({
    appModule: AppModule,
    ...options,
  })
}

afterAll(async () => {
  if (app) {
    await app.close()
  }
})
