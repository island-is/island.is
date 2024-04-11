import request from 'supertest'
import faker from 'faker'
import { getModelToken } from '@nestjs/sequelize'

import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, setupAppWithoutAuth } from '@island.is/testing/nest'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { UserProfile } from '../../user-profile/userProfile.model'
import { ActorProfile } from '../models/actor-profile.model'

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
    let delegationPreferenceModel: typeof ActorProfile = null
    let delegationsApi: DelegationsApi = null

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
      delegationsApi = app.get(DelegationsApi)
      delegationPreferenceModel = app.get(getModelToken(ActorProfile))
    })

    beforeEach(async () => {
      await userProfileModel.destroy({
        truncate: true,
      })
      await delegationPreferenceModel.destroy({
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

    it('GET /v2/users/actor-profiles/.national-id should return 200 and the actor profile for each delegation', async () => {
      const testNationalId1 = createNationalId('person')
      const testNationalId2 = createNationalId('person')

      // Arrange
      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockResolvedValue({
          data: [
            {
              toNationalId: testUserProfile.nationalId,
              fromNationalId: testNationalId1,
            },
            {
              toNationalId: testUserProfile.nationalId,
              fromNationalId: testNationalId2,
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
          totalCount: 2,
        })

      // only create actor profile for one of the delegations
      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
        emailNotifications: false,
      })

      // Act
      const res = await server
        .get('/v2/users/actor-profiles/.national-id')
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.data[0]).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
      })
      // Should default to true because we don't have a record for this delegation
      expect(res.body.data[1]).toStrictEqual({
        fromNationalId: testNationalId2,
        emailNotifications: true,
      })

      expect(
        delegationsApi.delegationsControllerGetDelegationRecords,
      ).toHaveBeenCalledWith({
        xQueryNationalId: testUserProfile.nationalId,
        scope: '@island.is/documents',
        direction: 'incoming',
      })
    })
  })
})
