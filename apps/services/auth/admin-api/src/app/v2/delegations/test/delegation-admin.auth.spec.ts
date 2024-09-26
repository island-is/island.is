import request from 'supertest'

import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import { User } from '@island.is/auth-nest-tools'
import { FixtureFactory } from '@island.is/services/auth/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { DelegationAdminScopes } from '@island.is/auth/scopes'
import { SequelizeConfigService } from '@island.is/auth-api-lib'

import { AppModule } from '../../../app.module'

describe('withoutAuth and permissions', () => {
  async function formatUrl(app: TestApp, endpoint: string, user?: User) {
    if (!endpoint.includes(':delegation')) {
      return endpoint
    }
    const factory = new FixtureFactory(app)
    const domain = await factory.createDomain({
      name: 'd1',
      apiScopes: [{ name: 's1' }],
    })
    const delegation = await factory.createCustomDelegation({
      fromNationalId: user?.nationalId,
      domainName: domain.name,
      scopes: [{ scopeName: 's1' }],
    })
    return endpoint.replace(':delegation', encodeURIComponent(delegation.id))
  }

  it.each`
    method      | endpoint
    ${'GET'}    | ${'/delegation-admin'}
    ${'DELETE'} | ${'/delegation-admin/:delegation'}
  `(
    '$method $endpoint should return 401 when user is not authenticated',
    async ({ method, endpoint }) => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())
      const url = await formatUrl(app, endpoint)

      // Act
      const res = await getRequestMethod(server, method)(url)

      // Assert
      expect(res.status).toEqual(401)
      expect(res.body).toMatchObject({
        status: 401,
        type: 'https://httpstatuses.org/401',
        title: 'Unauthorized',
      })
    },
  )

  it.each`
    method      | endpoint
    ${'GET'}    | ${'/delegation-admin'}
    ${'DELETE'} | ${'/delegation-admin/:delegation'}
  `(
    '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const user = createCurrentUser()
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())
      const url = await formatUrl(app, endpoint, user)

      // Act
      const res = await getRequestMethod(server, method)(url)

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

  it.each`
    method      | endpoint
    ${'DELETE'} | ${'/delegation-admin/:delegation'}
  `(
    '$method $endpoint should return 403 Forbidden when user does not have the admin scope',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const user = createCurrentUser({
        scope: [DelegationAdminScopes.read],
      })
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user,
        dbType: 'postgres',
      })
      const server = request(app.getHttpServer())
      const url = await formatUrl(app, endpoint, user)

      // Act
      const res = await getRequestMethod(server, method)(url)

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