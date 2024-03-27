import request from 'supertest'
import faker from 'faker'

import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, setupAppWithoutAuth } from '@island.is/testing/nest'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { UserProfile } from '../../user-profile/userProfile.model'
import { getModelToken } from '@nestjs/sequelize'
import { ClientType } from '../../types/ClientType'
import { MIGRATION_DATE } from '../user-profile.service'
import subMonths from 'date-fns/subMonths'
import addMonths from 'date-fns/addMonths'

const testUserProfile = {
  nationalId: createNationalId(),
  email: faker.internet.email(),
  mobilePhoneNumber: createPhoneNumber(),
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
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({
        status: 401,
        title: 'Unauthorized',
        type: 'https://httpstatuses.org/401',
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
        detail: 'Forbidden resource',
        status: 403,
        title: 'Forbidden',
        type: 'https://httpstatuses.org/403',
      })

      await app.cleanUp()
    })
  })

  describe('With auth', () => {
    let app = null
    let server = null
    let fixtureFactory = null
    let userProfileModel: typeof UserProfile = null

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [UserProfileScope.system],
        }),
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      userProfileModel = app.get(getModelToken(UserProfile))
    })

    beforeEach(async () => {
      await userProfileModel.destroy({
        truncate: true,
      })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('GET /v2/users/.national-id should return 200 with default UserProfileDto when the User Profile does not exist in db', async () => {
      const res = await server
        .get('/v2/users/.national-id')
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: null,
        emailVerified: false,
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        locale: null,
        documentNotifications: true,
      })
    })

    it('GET /v2/user/.national-id should return 200 with the UserProfileDto with email and phone number when client type is firstParty', async () => {
      // Arrange
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        lastNudge: subMonths(MIGRATION_DATE, 1),
      })

      const res = await server
        .get(`/v2/users/.national-id?clientType=${ClientType.FIRST_PARTY}`)
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: testUserProfile.email,
        emailVerified: false,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: null,
        isRestricted: true,
      })
    })

    it('GET /v2/user/.national-id should return 200 with the UserProfileDto without email and phone when client type is thirdParty', async () => {
      // Arrange
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        lastNudge: subMonths(MIGRATION_DATE, 1),
      })

      const res = await server
        .get(`/v2/users/.national-id?clientType=${ClientType.THIRD_PARTY}`)
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: null,
        emailVerified: false,
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: null,
      })
    })

    it('GET /v2/user/.national-id should return 200 with the UserProfileDto with the email and phone when client type is thirdParty and last nudge is more recent then the migration date', async () => {
      // Arrange
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        lastNudge: addMonths(MIGRATION_DATE, 1),
      })

      const res = await server
        .get(`/v2/users/.national-id?clientType=${ClientType.THIRD_PARTY}`)
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: testUserProfile.email,
        emailVerified: false,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: null,
        isRestricted: false,
      })
    })
  })
})
