import request from 'supertest'
import bodyParser from 'body-parser'

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
import { DelegationDTO, SequelizeConfigService } from '@island.is/auth-api-lib'
import { DelegationAdminCustomService } from '@island.is/auth-api-lib'

import { AppModule } from '../../../app.module'
import { includeRawBodyMiddleware } from '@island.is/infra-nest-server'

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

  describe('POST /delegation-admin/zendesk', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let delegationAdminService: DelegationAdminCustomService

    beforeEach(async () => {
      app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
        dbType: 'postgres',
        beforeServerStart: async (app) => {
          await new Promise((resolve) =>
            resolve(app.use(includeRawBodyMiddleware())),
          )
        },
      })

      server = request(app.getHttpServer())

      delegationAdminService = app.get(DelegationAdminCustomService)

      jest
        .spyOn(delegationAdminService, 'createDelegationByZendeskId')
        .mockImplementation(() => Promise.resolve())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it('POST /delegation-admin/zendesk should return 403 Forbidden when request signature is invalid.', async () => {
      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin/zendesk')
        .send({
          id: 'Incorrect body',
        })
        .set(
          'x-zendesk-webhook-signature',
          '6sUtGV8C8OdoGgCdsV2xRm3XeskZ33Bc5124RiAK4Q4=',
        )
        .set('x-zendesk-webhook-signature-timestamp', '2024-10-02T14:21:04Z')

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        status: 403,
        type: 'https://httpstatuses.org/403',
        title: 'Forbidden',
        detail: 'Forbidden resource',
      })
    })

    it('POST /delegation-admin/zendesk should return 200 when signature is valid', async () => {
      // Act
      const res = await getRequestMethod(
        server,
        'POST',
      )('/delegation-admin/zendesk')
        .send({
          id: 'test',
        })
        .set(
          'x-zendesk-webhook-signature',
          'ntgS06VGgd4z73lHjIpC2sk9azhRNi4u1xkXF/KPKTs=',
        )
        .set('x-zendesk-webhook-signature-timestamp', '2024-10-02T14:21:04Z')

      // Assert
      expect(res.status).toEqual(200)
    })
  })
})
