import request from 'supertest'

import { setupApp, setupAppWithoutAuth } from '@island.is/testing/nest'
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
    it('GET /v2/me should return 401 when user is not authenticated', async () => {
      // Arrange
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })

      const server = request(app.getHttpServer())

      // Act
      const res = await server.get('/v2/me')

      // Assert
      expect(res.status).toEqual(401)
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      })

      await app.cleanUp()
    })

    it('GET /v2/me should return 403 Forbidden when user does not have the correct scope', async () => {
      // Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser(),
      })

      const server = request(app.getHttpServer())

      // Act
      const res = await server.get('/v2/me')

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

    it('GET /v2/me should return 200 with default UserProfileDto when the User Profile does not exist in db', async () => {
      const res = await server.get('/v2/me')

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

    it('GET /v2/me should return 200 with UserProfileDto for logged in user', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)
      // Act
      const res = await server.get('/v2/me')

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

    it('GET /v2/me should return 200 with UserProfileDto for logged in user with no need for nudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        lastNudge: new Date(),
      })

      // Act
      const res = await server.get('/v2/me')

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
    })

    it('GET /v2/me should return 200 with UserProfileDto for logged in user with need for nudge since its been 6 months since last nudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)
      const lastNudge = new Date().setMonth(new Date().getMonth() - 7)

      await fixtureFactory.createUserProfile({
        nationalId: testUserProfile.nationalId,
        email: testUserProfile.email,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        lastNudge: new Date(lastNudge),
      })

      // Act
      const res = await server.get('/v2/me')

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
    })
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

      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)
      await fixtureFactory.createEmailVerification({
        ...testEmailVerification,
        email: newEmail,
      })
      await fixtureFactory.createSmsVerification({
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

    it('PATCH /v2/me should return 201 with changed data in response', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
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
    })

    it('PATCH /v2/me should return 201 with changed mobile data in response', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
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
    })

    it('PATCH /v2/me should return 201 with changed email data in response', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
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
    })

    it('PATCH /v2/me should return 400 when email verification code is not sent', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
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
    })

    it('PATCH /v2/me should return 400 when mobile verification code is incorrect', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
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
    })

    it('PATCH /v2/me should return 400 when there is no email verification code', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        statusCode: 400,
        message: 'Email verification code is required',
      })
    })

    it('PATCH /v2/me should return 400 when there is no sms verification code', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: newPhoneNumber,
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        statusCode: 400,
        message: 'Mobile phone number verification code is required',
      })
    })

    it('PATCH /v2/me should return 201 and clear email and phoneNumber null is sent', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: null,
        email: null,
      })

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toMatchObject({
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        email: null,
        emailVerified: false,
      })

      // Assert Db records
      const userProfileModel = await app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.email).toBe(null)
      expect(userProfile.mobilePhoneNumber).toBe(null)
    })
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

    it('POST /v2/me/nudge should return 201 and update the lastNudge field when user confirms nudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.post('/v2/me/nudge')

      // Assert
      expect(res.status).toEqual(201)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.lastNudge).not.toBeNull()
    })

    it(`POST /v2/me/nudge should return 201 and update the lastNudge field when user confirms nudge`, async () => {
      // Act
      const res = await server.post('/v2/me/nudge')

      // Assert
      expect(res.status).toEqual(201)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile).not.toBeNull()
      expect(userProfile.lastNudge).not.toBeNull()
    })
  })
})
