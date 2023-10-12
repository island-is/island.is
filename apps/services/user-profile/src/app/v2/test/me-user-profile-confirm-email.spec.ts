import { createCurrentUser } from '@island.is/testing/fixtures'
import { UserProfileScope } from '@island.is/auth/scopes'
import request from 'supertest'
import {
  getRequestMethod,
  setupApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'
import { FixtureFactory } from './fixtureFactory'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { getModelToken } from '@nestjs/sequelize'
import { EmailVerification } from '../../user-profile/emailVerification.model'
import { UserProfile } from '../userProfileV2.model'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'

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
  describe('Test without existing email verification', () => {
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
      ${'POST'} | ${'/v2/me/confirmEmail'}
    `(
      '$method $endpoint should return 400 when email verification does not exist for this user',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          email: testUserProfile.email,
          code: '123',
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Email verification does not exist for this user',
        })
      },
    )
  })

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

      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createEmailVerification({
        ...testEmailVerification,
      })

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        email: testEmailVerification.email,
        nationalId: testEmailVerification.nationalId,
        mobileStatus: DataStatus.NOT_VERIFIED,
        emailStatus: DataStatus.NOT_VERIFIED,
      })

      server = request(app.getHttpServer())
    })

    afterEach(() => {
      app.cleanUp()
    })

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirmEmail'}
    `(
      '$method $endpoint should return 201 and email should be verified when user confirms email',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          email: testEmailVerification.email,
          code: testEmailVerification.hash,
        })

        // Assert
        expect(res.status).toEqual(201)
        expect(res.body).toMatchObject({})

        // Assert that email verification has been removed from DB
        const emailVerificationModel = app.get(getModelToken(EmailVerification))
        const emailVerification = await emailVerificationModel.findOne({
          where: { nationalId: testEmailVerification.nationalId },
        })

        expect(emailVerification).toBe(null)

        // Assert that email is verified
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.emailVerified).toBe(true)
        expect(userProfile.emailStatus).toBe(DataStatus.VERIFIED)
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirmEmail'}
    `(
      '$method $endpoint should return 400 since the hash is incorrect',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          email: testEmailVerification.email,
          code: '000',
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Email verification with hash 000 does not exist',
        })

        // Assert that the email has not been confirmed in EmailVerification table
        const emailVerificationModel = app.get(getModelToken(EmailVerification))
        const emailVerification = await emailVerificationModel.findOne({
          where: { nationalId: testEmailVerification.nationalId },
        })

        expect(emailVerification.confirmed).toBe(false)

        // Assert that email is verified
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.emailVerified).toBe(false)
        expect(userProfile.emailStatus).toBe(DataStatus.NOT_VERIFIED)
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v2/me/confirmEmail'}
    `(
      '$method $endpoint should return 400 since the email is incorrect',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Act
        const res = await getRequestMethod(
          server,
          method,
        )(endpoint).send({
          email: newEmail,
          code: testEmailVerification.hash,
        })

        // Assert
        expect(res.status).toEqual(400)
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Email verification does not exist for this user',
        })

        // Assert that the email has not been confirmed in EmailVerification table
        const emailVerificationModel = app.get(getModelToken(EmailVerification))
        const emailVerification = await emailVerificationModel.findOne({
          where: { nationalId: testEmailVerification.nationalId },
        })

        console.log(emailVerification)
        expect(emailVerification.confirmed).toBe(false)

        // Assert that email is verified
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          where: { nationalId: testUserProfile.nationalId },
        })

        expect(userProfile.emailVerified).toBe(false)
        expect(userProfile.emailStatus).toBe(DataStatus.NOT_VERIFIED)
      },
    )
  })
})
