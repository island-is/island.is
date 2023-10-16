import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'

import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import {
  getRequestMethod,
  setupApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { FixtureFactory } from './fixtureFactory'
import { UserProfile } from '../userProfileV2.model'
import { SmsVerification } from '../../user-profile/smsVerification.model'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

const testUserProfile = {
  nationalId: '1234567890',
  email: 'test@test.is',
  mobilePhoneNumber: '1234567',
}

const newPhoneNumber = '9876543'

const testPhoneNumberVerification = {
  nationalId: testUserProfile.nationalId,
  mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
  smsCode: '123',
}

describe('Phone number confirmation', () => {
  describe('Test without existing phone number verification', () => {
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
      ${'POST'} | ${'/v2/me/confirmPhoneNumber'}
    `(
      '$method $endpoint should return 400 when phone number verification does not exist for this user',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          phoneNumber: testUserProfile.mobilePhoneNumber,
          code: '123',
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Sms verification does not exist for this user',
        })
      },
    )
  })

  describe('Test with existing phone number verification', () => {
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

      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createMobileVerification({
        ...testPhoneNumberVerification,
      })

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        mobilePhoneNumber: testPhoneNumberVerification.mobilePhoneNumber,
        nationalId: testPhoneNumberVerification.nationalId,
      })

      server = request(app.getHttpServer())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirmPhoneNumber'}
    `(
      '$method $endpoint should return 201 and phone number should be verified when user confirms the number',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        try {
          const res = await getRequestMethod(
            server,
            method,
          )(endpoint).send({
            phoneNumber: testPhoneNumberVerification.mobilePhoneNumber,
            code: testPhoneNumberVerification.smsCode,
          })

          // Assert
          expect(res.status).toEqual(201)
          expect(res.body).toMatchObject({})

          // Assert that phone number verification has been removed from DB
          const phoneNumberVerificationModel = app.get(
            getModelToken(SmsVerification),
          )
          const phoneNumberVerification =
            await phoneNumberVerificationModel.findOne({
              where: { nationalId: testPhoneNumberVerification.nationalId },
            })

          expect(phoneNumberVerification).toBe(null)

          // Assert that phone number is verified
          const userProfileModel = app.get(getModelToken(UserProfile))
          const userProfile = await userProfileModel.findOne({
            where: { nationalId: testUserProfile.nationalId },
          })

          expect(userProfile.mobilePhoneNumberVerified).toBe(true)
        } catch (e) {
          console.log(e)
        }
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirmPhoneNumber'}
    `(
      '$method $endpoint should return 400 since the code is incorrect',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          phoneNumber: testPhoneNumberVerification.mobilePhoneNumber,
          code: '000',
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'SMS code is not a match. 5 tries remaining.',
        })

        // Assert that the phoneNumber has not been confirmed in EmailVerification table
        const phoneNumberVerificationModel = app.get(
          getModelToken(SmsVerification),
        )
        const phoneNumberVerification =
          await phoneNumberVerificationModel.findOne({
            where: { nationalId: testPhoneNumberVerification.nationalId },
          })

        expect(phoneNumberVerification.confirmed).toBe(false)

        // Assert that phone number is verified
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.mobilePhoneNumberVerified).toBe(false)
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirmPhoneNumber'}
    `(
      '$method $endpoint should return 400 since the email is incorrect',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          phoneNumber: newPhoneNumber,
          code: testPhoneNumberVerification.smsCode,
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Sms verification does not exist for this user',
        })

        // Assert that the email has not been confirmed in EmailVerification table
        const phoneNumberVerificationModel = app.get(
          getModelToken(SmsVerification),
        )
        const phoneNumberVerification =
          await phoneNumberVerificationModel.findOne({
            where: { nationalId: testPhoneNumberVerification.nationalId },
          })

        expect(phoneNumberVerification.confirmed).toBe(false)

        // Assert that email is verified
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.mobilePhoneNumberVerified).toBe(false)
      },
    )
  })
})
