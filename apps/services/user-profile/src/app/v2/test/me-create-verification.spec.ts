import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import { setupApp } from '@island.is/testing/nest'

import { FixtureFactory } from './fixtureFactory'
import { EmailVerification } from '../../user-profile/emailVerification.model'
import { UserProfile } from '../../user-profile/userProfile.model'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { VerificationService } from '../../user-profile/verification.service'
import { SmsVerification } from '../../user-profile/smsVerification.model'

const testUserProfile = {
  nationalId: '1234567890',
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}

const newEmail = 'test1234@test.is'
const newPhoneNumber = '9876543'

const testEmailVerification = {
  nationalId: testUserProfile.nationalId,
  email: testUserProfile.email,
  hash: '123',
}

describe('Email confirmation', () => {
  describe('Test with existing email verification', () => {
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

      // Mock
      const verificationService = app.get(VerificationService)
      verificationService.sendConfirmationEmail = jest.fn()
      verificationService.sendConfirmationSms = jest.fn()

      // Arrange
      const fixtureFactory = new FixtureFactory(app)
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        email: testEmailVerification.email,
        nationalId: testEmailVerification.nationalId,
      })

      server = request(app.getHttpServer())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it('POST /v2/me/create-verification should return 201, email verification should be created and user profile email unchanged', async () => {
      // Act
      const res = await server.post('/v2/me/create-verification').send({
        email: newEmail,
      })

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toMatchObject({})

      // Assert that email verification has been removed from DB
      const emailVerificationModel = app.get(getModelToken(EmailVerification))
      const emailVerification = await emailVerificationModel.findOne({
        where: { nationalId: testEmailVerification.nationalId },
      })

      expect(emailVerification).not.toBe(null)

      // Assert that email is changed
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.email).toBe(testUserProfile.email)
    })

    it('POST /v2/me/create-verification should return 201, sms verification should be created and user profile phone number unchanged', async () => {
      // Act
      const res = await server.post('/v2/me/create-verification').send({
        mobilePhoneNumber: newPhoneNumber,
      })

      // Assert
      expect(res.status).toEqual(201)
      expect(res.body).toMatchObject({})

      // Assert that sms verification has been added to DB
      const smsVerificationModel = app.get(getModelToken(SmsVerification))
      const smsVerification = await smsVerificationModel.findOne({
        where: { nationalId: testEmailVerification.nationalId },
      })

      expect(smsVerification).not.toBe(null)

      // Assert that phone number is verified
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.mobilePhoneNumber).toBe(
        testUserProfile.mobilePhoneNumber,
      )
    })

    it('POST /v2/me/create-verification should return 400 when bot email and phone number are posted', async () => {
      // Act
      const res = await server.post('/v2/me/create-verification').send({
        mobilePhoneNumber: newPhoneNumber,
        email: newEmail,
      })

      // Assert
      expect(res.status).toEqual(400)
    })
  })
})
