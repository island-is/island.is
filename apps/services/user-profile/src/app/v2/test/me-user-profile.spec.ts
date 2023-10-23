import request from 'supertest'

import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'

import { FixtureFactory } from './fixtureFactory'
import { getModelToken } from '@nestjs/sequelize'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfile } from '../../user-profile/userProfile.model'
import { VerificationService } from '../../user-profile/verification.service'
import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'

const testUserProfile = {
  nationalId: '1234567890',
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}

const smsVerificationCode = '123'
const emailVerificationCode = '321'

const newEmail = 'test1234@test.is'
const newPhoneNumber = '9876543'

const testEmailVerification = {
  nationalId: testUserProfile.nationalId,
  email: testUserProfile.email,
  hash: emailVerificationCode,
}

const testSMSVerification = {
  nationalId: testUserProfile.nationalId,
  mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
  smsCode: smsVerificationCode,
}

describe('MeUserProfile', () => {
  describe('Auth and scopes', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 401 when user is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange

        const app = await setupAppWithoutAuth({
          AppModule: AppModule,
          SequelizeConfigService: SequelizeConfigService,
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        })

        await app.cleanUp()
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 403 Forbidden when user does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser(),
        })

        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })

        await app.cleanUp()
      },
    )
  })
  describe('GET user-profile', () => {
    let app = null
    let server = null

    beforeEach(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read],
        }),
      })

      server = request(app.getHttpServer())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 200 with default UserProfileDto when the User Profile does not exist in db',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(server, method)(endpoint)

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
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 200 with UserProfileDto for logged in user',
      async ({ method, endpoint }: TestEndpointOptions) => {
        const fixtureFactory = new FixtureFactory(app)
        await fixtureFactory.createUserProfile(testUserProfile)
        // Act
        const res = await getRequestMethod(server, method)(endpoint)

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
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 200 with UserProfileDto for logged in user with no need for nudge',
      async ({ method, endpoint }: TestEndpointOptions) => {
        const fixtureFactory = new FixtureFactory(app)
        await fixtureFactory.createUserProfile({
          ...testUserProfile,
          lastNudge: new Date(),
        })

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          email: testUserProfile.email,
          emailVerified: false,
          mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          mobilePhoneNumberVerified: false,
          documentNotifications: true,
          needsNudge: false,
        })
      },
    )

    it.each`
      method   | endpoint
      ${'GET'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 200 with UserProfileDto for logged in user with need for nudge since its been 6 months since last nudge',
      async ({ method, endpoint }: TestEndpointOptions) => {
        const fixtureFactory = new FixtureFactory(app)
        const lastNudge = new Date().setMonth(new Date().getMonth() - 7)

        await fixtureFactory.createUserProfile({
          nationalId: testUserProfile.nationalId,
          email: testUserProfile.email,
          mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          lastNudge: new Date(lastNudge),
        })

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          email: testUserProfile.email,
          emailVerified: false,
          mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
          mobilePhoneNumberVerified: false,
          documentNotifications: true,
          needsNudge: true,
        })
      },
    )
  })

  describe('PATCH user-profile', () => {
    let app = null
    let server = null
    let islyklarApi = null
    beforeEach(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read, UserProfileScope.write],
        }),
      })

      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)
      await fixtureFactory.createEmailVerification({
        ...testEmailVerification,
        email: newEmail,
      })

      await fixtureFactory.createMobileVerification({
        ...testSMSVerification,
        mobilePhoneNumber: newPhoneNumber,
      })

      // Mock confirmation email and sms
      const verificationService = app.get(VerificationService)
      verificationService.sendConfirmationEmail = jest.fn()
      verificationService.sendConfirmationSms = jest.fn()

      islyklarApi = app.get(IslyklarApi)
      islyklarApi.islyklarPut = jest
        .fn()
        .mockImplementation((user: PublicUser) => {
          return new Promise<PublicUser>((resolve) => resolve(user))
        })
      islyklarApi.islyklarGet = jest.fn()

      server = request(app.getHttpServer())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 with changed data in response',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          email: newEmail,
          mobilePhoneNumber: newPhoneNumber,
          emailVerificationCode: emailVerificationCode,
          mobilePhoneNumberVerificationCode: smsVerificationCode,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          email: newEmail,
          emailVerified: true,
          mobilePhoneNumber: newPhoneNumber,
          mobilePhoneNumberVerified: true,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe(newEmail)
        expect(userProfile.mobilePhoneNumber).toBe(newPhoneNumber)
      },
    )

    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 with changed mobile data in response',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          mobilePhoneNumber: newPhoneNumber,
          mobilePhoneNumberVerificationCode: smsVerificationCode,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          mobilePhoneNumber: newPhoneNumber,
          mobilePhoneNumberVerified: true,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.mobilePhoneNumber).toBe(newPhoneNumber)
      },
    )

    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 with changed email data in response',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          email: newEmail,
          emailVerificationCode: emailVerificationCode,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          email: newEmail,
          emailVerified: true,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe(newEmail)
      },
    )

    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 400 when email verification code is incorrect',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          email: newEmail,
          emailVerificationCode: '000',
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Email verification with hash 000 does not exist',
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe(testUserProfile.email)
      },
    )
    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 400 when mobile verification code is incorrect',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          mobilePhoneNumber: newPhoneNumber,
          mobilePhoneNumberVerificationCode: '000',
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'SMS code is not a match. 5 tries remaining.',
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.mobilePhoneNumber).toBe(
          testUserProfile.mobilePhoneNumber,
        )
      },
    )
    it.each`
      method     | endpoint
      ${'PATCH'} | ${'/v2/me'}
    `(
      '$method $endpoint should return 201 and clear email and phoneNumber when empty string is sent',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await server.patch(endpoint).send({
          mobilePhoneNumber: '',
          email: '',
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({
          mobilePhoneNumber: '',
          mobilePhoneNumberVerified: true,
          email: '',
          emailVerified: true,
        })

        // Assert Db records
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.email).toBe('')
        expect(userProfile.mobilePhoneNumber).toBe('')
      },
    )
  })

  describe('Nudge confirmation', () => {
    let app = null
    let server = null

    beforeEach(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read, UserProfileScope.write],
        }),
      })

      server = request(app.getHttpServer())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/nudge'}
    `(
      '$method $endpoint should return 201 and update the lastNudge field when user confirms nudge',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange

        const fixtureFactory = new FixtureFactory(app)

        await fixtureFactory.createUserProfile(testUserProfile)

        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(201)

        // Assert that lastNudge is updated
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.lastNudge).not.toBeNull()
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/nudge'}
    `(
      '$method $endpoint should return 201, and create a user profile with updated lastNudge field when user confirms nudge and no user profile exists',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        // const res = await getRequestMethod(server, method)(endpoint)
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(201)

        // Assert that lastNudge is updated
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile).not.toBeNull()
        expect(userProfile.lastNudge).not.toBeNull()
      },
    )
  })
})
