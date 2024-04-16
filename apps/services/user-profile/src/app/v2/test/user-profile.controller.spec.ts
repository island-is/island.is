import request from 'supertest'
import faker from 'faker'

import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { AdminPortalScope, UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, setupAppWithoutAuth } from '@island.is/testing/nest'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { UserProfile } from '../../user-profile/userProfile.model'
import { getModelToken } from '@nestjs/sequelize'

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

    it('GET /v2/user/.national-id should return 200 with the UserProfileDto when the User Profile exists in db', async () => {
      // Arrange
      await fixtureFactory.createUserProfile(testUserProfile)

      const res = await server
        .get('/v2/users/.national-id')
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
      })
    })
  })

  describe('Users collection', () => {
    let app = null
    let server = null
    let fixtureFactory = null
    let userProfileModel: typeof UserProfile = null

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [AdminPortalScope.serviceDesk],
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

    it('GET /v2/users/ with query for national id should return paginated list with all user profiles with given nation id', async () => {
      // Arrange
      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.get(
        `/v2/users/?search=${testUserProfile.nationalId}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        totalCount: 1,
        pageInfo: {
          hasNextPage: false,
        },
        data: [
          {
            nationalId: testUserProfile.nationalId,
            email: testUserProfile.email,
            mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          },
        ],
      })
    })

    it('GET /v2/users/ with query for email should return paginated list with all user profiles with given email', async () => {
      // Arrange
      await fixtureFactory.createUserProfile(testUserProfile)
      await fixtureFactory.createUserProfile({
        nationalId: createNationalId(),
        email: testUserProfile.email,
        mobilePhoneNumber: createPhoneNumber(),
      })

      // Act
      const res = await server.get(`/v2/users/?search=${testUserProfile.email}`)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        totalCount: 2,
        pageInfo: {
          hasNextPage: false,
        },
        data: [
          {
            nationalId: testUserProfile.nationalId,
            email: testUserProfile.email,
            mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          },
          {
            nationalId: expect.not.stringMatching(testUserProfile.nationalId),
            email: testUserProfile.email,
            mobilePhoneNumber: expect.any(String),
          },
        ],
      })
    })

    it('GET /v2/users/ with query for mobilePhoneNumber should return paginated list with all user profiles with given mobilePhoneNumber', async () => {
      // Arrange
      await fixtureFactory.createUserProfile(testUserProfile)
      await fixtureFactory.createUserProfile({
        nationalId: createNationalId(),
        email: faker.internet.email(),
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
      })

      // Act
      const res = await server.get(
        `/v2/users/?search=${testUserProfile.mobilePhoneNumber}`,
      )

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        totalCount: 2,
        pageInfo: {
          hasNextPage: false,
        },
        data: [
          {
            nationalId: testUserProfile.nationalId,
            email: testUserProfile.email,
            mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          },
          {
            nationalId: expect.not.stringMatching(testUserProfile.nationalId),
            email: expect.any(String),
            mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          },
        ],
      })
    })

    it('GET /v2/users/ with query for invalid search paramas should result in 400 Bad Request', async () => {
      // Act
      const res1 = await server.get(
        `/v2/users/?search=${testUserProfile.nationalId + '1'}`,
      )
      const res2 = await server.get(`/v2/users/?search=g@g`)
      const res3 = await server.get(`/v2/users/?search=+3541234567`)

      // Assert
      expect(res1.status).toEqual(400)
      expect(res2.status).toEqual(400)
      expect(res3.status).toEqual(400)
    })
  })
})
