import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope, ApiScope } from '@island.is/auth/scopes'
import { setupApp, TestApp } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../../test/fixture-factory'
import { EmailVerification } from '../models/emailVerification.model'
import { UserProfile } from '../models/userProfile.model'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { VerificationService } from '../verification.service'
import { SmsVerification } from '../models/smsVerification.model'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { Emails } from '../models/emails.model'

const testUserProfileEmail = {
  email: 'test@test.is',
  primary: true,
  emailStatus: DataStatus.NOT_DEFINED,
}
const testUserProfile = {
  nationalId: '1234567890',
  emails: [testUserProfileEmail],
  mobilePhoneNumber: '1234567',
}

const newEmail = 'test1234@test.is'
const newPhoneNumber = '9876543'

const testEmailVerification = {
  nationalId: testUserProfile.nationalId,
  email: testUserProfileEmail.email,
  hash: '123',
}

describe('Email confirmation', () => {
  describe('Test with existing email verification', () => {
    let app: TestApp
    let server: request.SuperTest<request.Test>
    beforeEach(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [
            UserProfileScope.read,
            UserProfileScope.write,
            ApiScope.internal,
          ],
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
        nationalId: testEmailVerification.nationalId,
      })

      server = request(app.getHttpServer())
    })

    afterEach(async () => {
      await app.cleanUp()
    })

    it('POST /v2/actor/create-verification should return 200, email verification should be created and user profile email unchanged', async () => {
      // Act
      const res = await server.post('/v2/actor/create-verification').send({
        email: newEmail,
      })

      // Assert
      expect(res.status).toEqual(200)
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
        include: {
          model: Emails,
          as: 'emails',
          required: false,
          where: {
            primary: true,
          },
        },
      })

      expect(userProfile.emails?.[0].email).toBe(testUserProfileEmail.email)
    })

    it('POST /v2/actor/create-verification should return 200, sms verification should be created and user profile phone number unchanged', async () => {
      // Act
      const res = await server.post('/v2/actor/create-verification').send({
        mobilePhoneNumber: newPhoneNumber,
      })

      // Assert
      expect(res.status).toEqual(200)
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

    it('POST /v2/actor/create-verification should return 400 when bot email and phone number are posted', async () => {
      // Act
      const res = await server.post('/v2/actor/create-verification').send({
        mobilePhoneNumber: newPhoneNumber,
        email: newEmail,
      })

      // Assert
      expect(res.status).toEqual(400)
    })
  })
})
