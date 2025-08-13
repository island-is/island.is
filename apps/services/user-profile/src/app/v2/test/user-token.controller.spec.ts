import request from 'supertest'

import { setupApp, setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'

import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { AppModule } from '../../app.module'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { UserProfileScope } from '@island.is/auth/scopes'

const fakeToken =
  'eMzc4XZRiEoIr08NwgWakL:BXN84bEryZOzApb8s6F570Za4yPQHIJ5CRDDboTGpejw-nzfnQranRFncwYQTItpnx0LwTxcAB2drXEw9n-cZNu0-sZAEHFPckIACYZITdMb13zsYnAAwYW4Asw0GFqkL_A1Xrhb9N3j'

const testUserToken = {
  nationalId: createNationalId(),
  deviceToken: fakeToken,
}

describe('UserTokenController', () => {
  describe('No auth', () => {
    it('GET /v2/userTokens/.nationalId should return 401 when user is not authenticated', async () => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })

      const server = request(app.getHttpServer())

      // Act
      const res = await server
        .get('/v2/users/.nationalId/device-tokens')
        .set('X-Param-National-Id', testUserToken.nationalId)

      // Assert
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({
        status: 401,
        title: 'Unauthorized',
        type: 'https://httpstatuses.org/401',
      })

      await app.cleanUp()
    })

    it('GET /v2/userTokens/.nationalId should return 403 Forbidden when user does not have the correct scope', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({}),
      })

      const server = request(app.getHttpServer())

      // Act
      const res = await server
        .get('/v2/users/.nationalId/device-tokens')
        .set('X-Param-National-Id', '1234567890')

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        detail: 'Forbidden resource',
        status: 403,
        title: 'Forbidden',
        type: 'https://httpstatuses.org/403',
      })

      await app.cleanUp()
    })
  })

  describe('With auth', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [UserProfileScope.admin],
        }),
      })

      server = request(app.getHttpServer())

      const fixtureFactory = new FixtureFactory(app)
      await fixtureFactory.createUserDeviceToken(testUserToken)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('GET /v2/userTokens/.nationalId should return 200 when user is authenticated with one UserDeviceToken', async () => {
      // Act
      const res = await server
        .get('/v2/users/.nationalId/device-tokens')
        .set('X-Param-National-Id', testUserToken.nationalId)

      // Assert
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(1)
      expect(res.body).toMatchObject([
        {
          nationalId: testUserToken.nationalId,
          deviceToken: testUserToken.deviceToken,
        },
      ])
    })

    it('GET /v2/userTokens/.nationalId should return 200 when user is authenticated with empty UserDeviceToken array', async () => {
      // Act
      const res = await server
        .get('/v2/users/.nationalId/device-tokens')
        .set('X-Param-National-Id', createNationalId())

      // Assert
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(0)
      expect(res.body).toMatchObject([])
    })
  })
})
