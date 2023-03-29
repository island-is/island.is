import request from 'supertest'

import {
  Client,
  clientBaseAttributes,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'
import { FixtureFactory } from '@island.is/services/auth/testing'

const tenantId = '@test.is'
const clientId = '@test.is/test-client'

const createTestClientData = async (app: TestApp, user: User) => {
  const fixtureFactory = new FixtureFactory(app)
  await fixtureFactory.createDomain({
    name: tenantId,
    nationalId: user.nationalId,
  })
}

describe('MeClientsController with auth', () => {
  const user = createCurrentUser({ scope: [AdminPortalScope.idsAdmin] })

  // Might be able to keep these kinds of tests simple, eg in me-clients.auth.spec.ts
  it.todo('should return clients in a tenant which user owns')
  it.todo('should not return clients in a tenant which user does not own')
  it.todo('should return clients in another tenant as superusers')
  it.todo('should create client in a tenant which user owns')
  it.todo('should not create client in a tenant which user does not own')
  it.todo('should create client in another tenant as superuser')

  it.each`
    clientType   | typeSpecificDefaults
    ${'web'}     | ${{}}
    ${'machine'} | ${{ allowOfflineAccess: false, requirePkce: false }}
    ${'native'}  | ${{ absoluteRefreshTokenLifetime: 365 * 24 * 60 * 60, requireClientSecret: false, slidingRefreshTokenLifetime: 90 * 24 * 60 * 60 }}
  `(
    'should create $clientType client with correct defaults',
    async ({ clientType, typeSpecificDefaults }) => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
      })
      const server = request(app.getHttpServer())
      await createTestClientData(app, user)
      const newClient = {
        clientId: '@test.is/new-test-client',
        clientName: 'New test client',
        clientType,
      }

      // Act
      const res = await server
        .post(`/v2/me/tenants/${tenantId}/clients`)
        .send(newClient)

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toEqual({
        // Todo: Uncomment when merged in #10673
        //...clientBaseAttributes,
        clientId: newClient.clientId,
        clientType: newClient.clientType,
        //clientName: newClient.clientName,
        //tenantId,

        //...typeSpecificDefaults,
      })
    },
  )
})
