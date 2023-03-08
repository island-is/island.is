import { TestApp, testServer, useAuth } from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AppModule } from '../app/app.module'
import { User } from '@island.is/auth-nest-tools'

export let app: TestApp

export const setupWithAuth = async (user: User): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    hooks: [useAuth({ auth: user })],
  })
  return app
}

export const setupWithoutAuth = () => {
  return testServer({
    appModule: AppModule,
  })
}

export const setupWithoutScope = () => {
  const user = createCurrentUser()
  return testServer({
    appModule: AppModule,
    hooks: [useAuth({ auth: user })],
  })
}

afterAll(async () => {
  if (app) {
    app.cleanUp()
  }
})
