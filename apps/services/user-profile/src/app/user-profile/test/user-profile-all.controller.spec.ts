import request from 'supertest'
import faker from 'faker'
import { getModelToken } from '@nestjs/sequelize'
import subMonths from 'date-fns/subMonths'
import addMonths from 'date-fns/addMonths'

import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { AdminPortalScope, UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { UserProfile } from '../models/userProfile.model'
import { ClientType } from '../../types/ClientType'
import { ActorProfile } from '../models/actor-profile.model'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { Locale } from '../../user-profile/types/localeTypes'
import { uuid } from 'uuidv4'

const testNattionalId = createNationalId('person')

const testUserProfile = {
  nationalId: testNattionalId,
  mobilePhoneNumber: createPhoneNumber(),
  documentNotifications: true,
  locale: Locale.ICELANDIC,
  emails: [
    {
      id: uuid(),
      email: faker.internet.email(),
      emailStatus: DataStatus.NOT_DEFINED,
      primary: true,
    },
  ],
}

const MIGRATION_DATE = new Date('2024-05-10')

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
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let actorProfileModel: typeof ActorProfile
    let delegationsApi: DelegationsApi

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
      actorProfileModel = app.get(getModelToken(ActorProfile))
    })

    beforeEach(async () => {
      await userProfileModel.destroy({
        truncate: true,
      })
      await actorProfileModel.destroy({
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
        email: testUserProfile.emails[0].email,
        emailVerified: false,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: null,
        isRestricted: true,
      })
    })

    it('GET /v2/user/.national-id should return 200 with the UserProfileDto with primaryEmail email and phone number when client type is firstParty', async () => {
      // Arrange
      const primaryEmail = faker.internet.email()
      const secondaryEmail = faker.internet.email()
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [
          {
            email: secondaryEmail,
            emailStatus: DataStatus.NOT_DEFINED,
            primary: false,
          },
          {
            email: primaryEmail,
            emailStatus: DataStatus.VERIFIED,
            primary: true,
          },
        ],
        lastNudge: subMonths(MIGRATION_DATE, 1),
      })

      // Act
      const res = await server
        .get(`/v2/users/.national-id?clientType=${ClientType.FIRST_PARTY}`)
        .set('X-Param-National-Id', testUserProfile.nationalId)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: primaryEmail,
        emailVerified: true,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: true,
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
        email: testUserProfile.emails[0].email,
        emailVerified: false,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: false,
        documentNotifications: true,
        needsNudge: null,
        isRestricted: false,
      })
    })

    describe('GET /v2/users/.to-national-id/actor-profiles/.from-national-id', () => {
      const testNationalId1 = createNationalId('person')
      const testNationalId2 = createNationalId('person')

      beforeEach(async () => {
        jest
          .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
          .mockResolvedValue({
            data: [
              {
                toNationalId: testUserProfile.nationalId,
                fromNationalId: testNationalId1,
                subjectId: null,
                type: 'fromNational',
              },
              {
                toNationalId: testUserProfile.nationalId,
                fromNationalId: testNationalId2,
                subjectId: null,
                type: 'fromNational',
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
      })

      it('should return 200 and the extended actor profile if user profile exists', async () => {
        await fixtureFactory.createUserProfile(testUserProfile)

        const newEmail = await fixtureFactory.createEmail({
          email: faker.internet.email(),
          emailStatus: DataStatus.VERIFIED,
          primary: false,
          nationalId: testUserProfile.nationalId,
        })

        await fixtureFactory.createActorProfile({
          toNationalId: testUserProfile.nationalId,
          fromNationalId: testNationalId1,
          emailNotifications: false,
          emailsId: newEmail.id,
        })

        // Act
        const res = await server
          .get('/v2/users/.to-national-id/actor-profiles/.from-national-id')
          .set('X-Param-To-National-Id', testUserProfile.nationalId)
          .set('X-Param-From-National-Id', testNationalId1)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toStrictEqual({
          fromNationalId: testNationalId1,
          emailNotifications: false,
          email: newEmail.email,
          documentNotifications: testUserProfile.documentNotifications,
          locale: testUserProfile.locale,
          emailVerified: newEmail.emailStatus === DataStatus.VERIFIED,
        })

        expect(
          delegationsApi.delegationsControllerGetDelegationRecords,
        ).toHaveBeenCalledWith({
          xQueryNationalId: testUserProfile.nationalId,
          scope: '@island.is/documents',
          direction: 'incoming',
        })
      })

      it('should return 200 and the extended actor profile if user profile exists, should default to emailNotifications = true', async () => {
        // Arrange
        await fixtureFactory.createUserProfile(testUserProfile)

        // Act
        const res = await server
          .get('/v2/users/.to-national-id/actor-profiles/.from-national-id')
          .set('X-Param-To-National-Id', testUserProfile.nationalId)
          .set('X-Param-From-National-Id', testNationalId1)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toStrictEqual({
          fromNationalId: testNationalId1,
          emailNotifications: true,
          email: testUserProfile.emails[0].email,
          documentNotifications: testUserProfile.documentNotifications,
          locale: testUserProfile.locale,
          emailVerified: false,
        })
      })

      it('should return 400 if toNationalId is invalid', async () => {
        // Arrange
        await fixtureFactory.createUserProfile(testUserProfile)

        // Act
        const res = await server
          .get('/v2/users/.to-national-id/actor-profiles/.from-national-id')
          .set('X-Param-To-National-Id', 'invalid')
          .set('X-Param-From-National-Id', testNationalId1)

        // Assert
        expect(res.status).toEqual(400)
      })

      it('should return 400 if fromNationalId is invalid', async () => {
        // Arrange
        await fixtureFactory.createUserProfile(testUserProfile)

        // Act
        const res = await server
          .get('/v2/users/.to-national-id/actor-profiles/.from-national-id')
          .set('X-Param-To-National-Id', 'invalid')
          .set('X-Param-From-National-Id', testNationalId1)

        // Assert
        expect(res.status).toEqual(400)
      })

      it('should return 400 if delegation does not exist', async () => {
        // Arrange
        await fixtureFactory.createUserProfile(testUserProfile)

        // Act
        const res = await server
          .get('/v2/users/.to-national-id/actor-profiles/.from-national-id')
          .set('X-Param-To-National-Id', testUserProfile.nationalId)
          .set('X-Param-From-National-Id', createNationalId('person'))

        // Assert
        expect(res.status).toEqual(400)
      })
    })
  })

  describe('Users collection', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile

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
            email: testUserProfile.emails[0].email,
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
        emails: testUserProfile.emails,
        mobilePhoneNumber: createPhoneNumber(),
      })

      // Act
      const res = await server.get(
        `/v2/users/?search=${testUserProfile.emails[0].email}`,
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
            email: testUserProfile.emails[0].email,
            mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          },
          {
            nationalId: expect.not.stringMatching(testUserProfile.nationalId),
            email: testUserProfile.emails[0].email,
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
        emails: [
          {
            emailStatus: DataStatus.VERIFIED,
            email: faker.internet.email(),
            primary: false,
          },
        ],
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
            email: testUserProfile.emails?.[0].email,
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

    it.each`
      search                                        | expected
      ${testUserProfile.nationalId + '1'}           | ${400}
      ${'g@g'}                                      | ${400}
      ${'+3541234567'}                              | ${400}
      ${'1234567'}                                  | ${400}
      ${testUserProfile.nationalId.substring(0, 9)} | ${400}
    `(
      `GET /v2/users/ with query search=$search paramas should result in $expected`,
      async ({ search, expected }: { search: string; expected: number }) => {
        // Act
        const res = await server.get(`/v2/users/?search=${search}`)

        // Assert
        expect(res.status).toEqual(expected)
      },
    )
  })
})
