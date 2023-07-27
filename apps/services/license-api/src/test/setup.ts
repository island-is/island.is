import { TestApp, testServer, useAuth } from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AppModule } from '../app/app.module'
import { User } from '@island.is/auth-nest-tools'
import { LicenseService } from '../app/modules/license/license.service'
import { TestingModuleBuilder } from '@nestjs/testing'

export let app: TestApp

class MockLicenseService implements Partial<LicenseService> {
  updateLicense = jest
    .fn()
    .mockResolvedValue({ ok: true, updatedSuccess: true })
  revokeLicense = jest.fn().mockResolvedValue({ ok: true, deleteSuccess: true })
  verifyLicense = jest.fn().mockResolvedValue({ ok: true, valid: true })
}

export const setupWithAuth = async (user: User): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    override: (builder: TestingModuleBuilder) =>
      builder.overrideProvider(LicenseService).useClass(MockLicenseService),
    hooks: [useAuth({ auth: user })],
  })
  return app
}

export const setupWithoutAuth = () => {
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
  })
}

export const setupWithoutScope = () => {
  const user = createCurrentUser()
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [useAuth({ auth: user })],
  })
}

afterAll(async () => {
  if (app) {
    app.cleanUp()
  }
})
