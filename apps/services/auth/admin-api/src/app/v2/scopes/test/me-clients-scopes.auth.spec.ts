import { FixtureFactory } from '@island.is/services/auth/testing'
import request from 'supertest'

import { SequelizeConfigService } from '@island.is/auth-api-lib'
import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { AppModule } from '../../../app.module'

const tenantId = '@test.is'
const clientId = '@test.is/test-client'

const createTestData = async (app: TestApp) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: '1234567890',
  })
  await fixtureFactory.createClient({ clientId: clientId })
}

describe('MeClientsScopes withoutAuth and permissions', () => {
  it.each`
    method   | endpoint
    ${'GET'} | ${`/v2/me/tenants/${encodeURIComponent(tenantId)}/clients/${encodeURIComponent(clientId)}/scopes`}
  `(
    '$method $endpoint should return 401 when user is not authenticated',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
      })
      const server = request(app.getHttpServer())
      await createTestData(app)

      // Act
      const res = await getRequestMethod(server, method)(endpoint)

      // Assert
      expect(res.status).toEqual(401)
      expect(res.body).toMatchObject({
        status: 401,
        type: 'https://httpstatuses.org/401',
        title: 'Unauthorized',
      })

      // CleanUp
      app.cleanUp()
    },
  )

  it.each`
    method   | endpoint
    ${'GET'} | ${`/v2/me/tenants/${encodeURIComponent(tenantId)}/clients/${encodeURIComponent(clientId)}/scopes`}
  `(
    '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const user = createCurrentUser()
      const app = await setupApp({ AppModule, SequelizeConfigService, user })
      const server = request(app.getHttpServer())
      await createTestData(app)

      // Act
      const res = await getRequestMethod(server, method)(endpoint)

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        status: 403,
        type: 'https://httpstatuses.org/403',
        title: 'Forbidden',
        detail: 'Forbidden resource',
      })

      // CleanUp
      app.cleanUp()
    },
  )
})
