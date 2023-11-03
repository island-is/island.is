import request from 'supertest'

import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, setupAppWithoutAuth } from '@island.is/testing/nest'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { FixtureFactory } from './fixtureFactory'

const testNationalId = '0101302399'

const testUserProfile = {
  nationalId: testNationalId,
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}

describe('UserProfileController', () => {
  describe('No auth', () => {
    it('GET /v2/users/.national-id should return 401 when user is not authenticated', async () => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })

      const server = request(app.getHttpServer())

      // Act
      const res = await server
        .get('/v2/users/.national-id')
        .set('X-Param-National-Id', '1234567890')

      // Assert
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      })

      await app.cleanUp()
    })

    it('GET /v2/users/.national-id should return 403 Forbidden when user does not have the correct scope', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({}),
      })

      const server = request(app.getHttpServer())

      // Act
      const res = await server
        .get('/v2/users/.national-id')
        .set('X-Param-National-Id', '1234567890')

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      })

      await app.cleanUp()
    })
  })

  describe('With auth', () => {
    let app = null
    let server = null

    beforeEach(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [UserProfileScope.system],
        }),
      })

      server = request(app.getHttpServer())
    })

    afterEach(async () => {
      await app.cleanUp()
    })

    it('GET /v2/users/.national-id should return 200 with default UserProfileDto when the User Profile does not exist in db', async () => {
      const res = await server
        .get('/v2/users/.national-id')
        .set('X-Param-National-Id', testNationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testNationalId,
        email: null,
        emailVerified: false,
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        locale: null,
        documentNotifications: true,
      })
    })

    it('GET /v2/user/.national-id should return 200 with the UserProfileDto when the User Profile exists in db', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)
      const userProfile = fixtureFactory.createUserProfile(testUserProfile)

      const res = await server
        .get('/v2/users/.national-id')
        .set('X-Param-National-Id', testNationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testNationalId,
        email: testUserProfile.email,
        emailVerified: false,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: null,
      })
    })
  })
})
