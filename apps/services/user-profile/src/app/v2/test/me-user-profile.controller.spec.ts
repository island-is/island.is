import { getModelToken } from '@nestjs/sequelize'
import subMonths from 'date-fns/subMonths'
import faker from 'faker'
import request, { SuperTest, Test } from 'supertest'

import { UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
  createVerificationCode,
} from '@island.is/testing/fixtures'
import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'

import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfile } from '../../user-profile/userProfile.model'
import { VerificationService } from '../../user-profile/verification.service'
import { NUDGE_INTERVAL } from '../user-profile.service'
import { formatPhoneNumber } from '../../utils/format-phone-number'
import { SmsVerification } from '../../user-profile/smsVerification.model'
import { EmailVerification } from '../../user-profile/emailVerification.model'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

const testUserProfile = {
  nationalId: createNationalId(),
  email: faker.internet.email(),
  mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
}

const smsVerificationCode = createVerificationCode()
const emailVerificationCode = createVerificationCode()

const newEmail = faker.internet.email()
const newPhoneNumber = createPhoneNumber()
const formattedNewPhoneNumber = formatPhoneNumber(newPhoneNumber)

const audkenniSimNumber = createPhoneNumber()

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

describe('MeUserProfileController', () => {
  describe('GET /v2/me', () => {
    let app: TestApp = null
    let server: SuperTest<Test> = null
    let fixtureFactory: FixtureFactory = null
    let userProfileModel: typeof UserProfile = null

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read],
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

    it('should return 200 with default user profile when user does not exist in db', async () => {
      // Act
      const res = await server.get('/v2/me')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: null,
        emailVerified: false,
        emailStatus: DataStatus.NOT_DEFINED,
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        mobileStatus: DataStatus.NOT_DEFINED,
        locale: null,
        documentNotifications: true,
        needsNudge: null,
      })
    })

    const currentDate = new Date()
    const expiredDate = subMonths(new Date(), NUDGE_INTERVAL + 1)

    it.each`
      verifiedField                     | isVerified | lastNudge      | needsNudgeExpected
      ${['email']}                      | ${true}    | ${null}        | ${true}
      ${['email']}                      | ${true}    | ${currentDate} | ${false}
      ${['email']}                      | ${true}    | ${expiredDate} | ${true}
      ${['email']}                      | ${false}   | ${null}        | ${null}
      ${['email']}                      | ${false}   | ${currentDate} | ${null}
      ${['email']}                      | ${false}   | ${expiredDate} | ${null}
      ${['mobilePhoneNumber']}          | ${true}    | ${null}        | ${true}
      ${['mobilePhoneNumber']}          | ${true}    | ${currentDate} | ${false}
      ${['mobilePhoneNumber']}          | ${true}    | ${expiredDate} | ${true}
      ${['mobilePhoneNumber']}          | ${false}   | ${null}        | ${null}
      ${['mobilePhoneNumber']}          | ${false}   | ${currentDate} | ${null}
      ${['mobilePhoneNumber']}          | ${false}   | ${expiredDate} | ${null}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${null}        | ${true}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${currentDate} | ${false}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${expiredDate} | ${true}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${null}        | ${null}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${currentDate} | ${null}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${expiredDate} | ${null}
      ${null}                           | ${false}   | ${null}        | ${null}
      ${null}                           | ${false}   | ${currentDate} | ${false}
      ${null}                           | ${false}   | ${expiredDate} | ${true}
    `(
      'should return needsNudge=$needsNudgeExpected when $verifiedField is set and lastNudge=$lastNudge',
      async ({
        verifiedField,
        isVerified,
        lastNudge,
        needsNudgeExpected,
      }: {
        verifiedField: string[] | null
        isVerified: boolean
        lastNudge: Date | null
        needsNudgeExpected: boolean | null
      }) => {
        // Arrange
        const expectedTestValues = verifiedField
          ? verifiedField.reduce((acc, field) => {
              return {
                ...acc,
                [field]: testUserProfile[field],
                [`${field}Verified`]: isVerified,
              }
            }, {})
          : {}
        await fixtureFactory.createUserProfile({
          nationalId: testUserProfile.nationalId,
          ...expectedTestValues,
          lastNudge,
        })

        // Act
        const res = await server.get('/v2/me')

        // Assert
        expect(res.status).toEqual(200)
        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          documentNotifications: true,
          ...expectedTestValues,
          needsNudge: needsNudgeExpected,
        })
      },
    )
  })

  describe('PATCH user-profile', () => {
    let app = null
    let server = null
    let islyklarApi = null
    let confirmSmsSpy = null

    beforeEach(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read, UserProfileScope.write],
          audkenniSimNumber,
        }),
        // Using postgres here because incrementing the tries field for verification is handled differently in sqlite
        dbType: 'postgres',
      })
      server = request(app.getHttpServer())
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
      confirmSmsSpy = jest.spyOn(verificationService, 'confirmSms')

      // Mock islyklar api responses
      islyklarApi = app.get(IslyklarApi)
      islyklarApi.islyklarPut = jest.fn()
      islyklarApi.islyklarPost = jest
        .fn()
        .mockImplementation(({ user }: { user: PublicUser }) => {
          return new Promise((resolve) => {
            resolve(user)
          })
        })
      islyklarApi.islyklarGet = jest.fn().mockResolvedValue({
        ssn: testUserProfile.nationalId,
        email: testUserProfile.email,
        mobile: testUserProfile.mobilePhoneNumber,
      })
    })

    afterEach(async () => {
      await app.cleanUp()
    })

    it('PATCH /v2/me should return 200 with changed data in response', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
        mobilePhoneNumber: formattedNewPhoneNumber,
        emailVerificationCode: emailVerificationCode,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: newEmail,
        emailVerified: true,
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerified: true,
        emailStatus: DataStatus.VERIFIED,
        mobileStatus: DataStatus.VERIFIED,
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.email).toBe(newEmail)
      expect(userProfile.mobilePhoneNumber).toBe(formattedNewPhoneNumber)
      expect(userProfile.emailVerified).toBe(true)
      expect(userProfile.mobilePhoneNumberVerified).toBe(true)
      expect(userProfile.emailStatus).toBe(DataStatus.VERIFIED)
      expect(userProfile.mobileStatus).toBe(DataStatus.VERIFIED)
    })

    it('PATCH /v2/me should return 200 with changed mobile data in response', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerified: true,
        mobileStatus: DataStatus.VERIFIED,
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.mobilePhoneNumber).toBe(formattedNewPhoneNumber)
      expect(userProfile.mobilePhoneNumberVerified).toBe(true)
      expect(userProfile.mobileStatus).toBe(DataStatus.VERIFIED)

      // Check if confirmSms is called once, so we know it was not skipped with audkenniSimNumber
      expect(confirmSmsSpy).toBeCalledTimes(1)
    })

    it('PATCH /v2/me should return 200 with changed mobile data in response and skip verification when when phone number matches audkenniSimNumber', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: audkenniSimNumber,
        mobilePhoneNumberVerificationCode: '',
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        mobilePhoneNumber: formatPhoneNumber(audkenniSimNumber),
        mobilePhoneNumberVerified: true,
        mobileStatus: DataStatus.VERIFIED,
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.mobilePhoneNumber).toBe(
        formatPhoneNumber(audkenniSimNumber),
      )
      expect(userProfile.mobilePhoneNumberVerified).toBe(true)
      expect(userProfile.mobileStatus).toBe(DataStatus.VERIFIED)

      expect(confirmSmsSpy).toBeCalledTimes(0)
    })

    it('PATCH /v2/me should return 200 with changed email data in response', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: newEmail,
        emailVerified: true,
        emailStatus: DataStatus.VERIFIED,
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.email).toBe(newEmail)
      expect(userProfile.emailVerified).toBe(true)
      expect(userProfile.emailStatus).toBe(DataStatus.VERIFIED)
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
        title: 'Attempt Failed',
        status: 400,
        detail:
          '2 attempts remaining. Validation issues found in field: emailVerificationCode',
        type: 'https://docs.devland.is/reference/problems/attempt-failed',
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.email).toBe(testUserProfile.email)

      const verificationModel = app.get(getModelToken(EmailVerification))
      const verification = await verificationModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(verification.tries).toBe(1)
    })

    it('PATCH /v2/me should return 400 when mobile verification code is incorrect', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: '000',
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        title: 'Attempt Failed',
        status: 400,
        detail:
          '2 attempts remaining. Validation issues found in field: smsVerificationCode',
        remainingAttempts: 2,
        type: 'https://docs.devland.is/reference/problems/attempt-failed',
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.mobilePhoneNumber).toBe(
        testUserProfile.mobilePhoneNumber,
      )

      const verificationModel = app.get(getModelToken(SmsVerification))
      const verification = await verificationModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(verification.tries).toBe(1)
    })

    it('PATCH /v2/me should return 400 when there is no email verification code', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        detail: 'Email verification code is required',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })

    it('PATCH /v2/me should return 400 when there is no sms verification code', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        detail: 'Mobile phone number verification code is required',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })

    it('PATCH /v2/me should return 400 when to many failed sms attempts have occurred', async () => {
      // Arrange
      const verificationModel = app.get(getModelToken(SmsVerification))
      const verification = await verificationModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      verification.tries = 3
      await verification.save()

      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: '000',
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        detail: '0 attempts remaining.',
        status: 400,
        title: 'Attempt Failed',
        type: 'https://docs.devland.is/reference/problems/attempt-failed',
      })
    })

    it('PATCH /v2/me should return 400 when to many failed email attempts have occurred', async () => {
      // Arrange
      const verificationModel = app.get(getModelToken(EmailVerification))
      const verification = await verificationModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      verification.tries = 3
      await verification.save()

      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
        emailVerificationCode: '000',
      })

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        detail:
          'Too many failed email verifications. Please restart verification.',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })

    it('PATCH /v2/me should return 200 and clear email and phoneNumber when empty string is sent', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: '',
        email: '',
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        email: null,
        emailVerified: false,
        mobileStatus: DataStatus.EMPTY,
        emailStatus: DataStatus.EMPTY,
      })

      // Assert Db records
      const userProfileModel = await app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.email).toBe(null)
      expect(userProfile.mobilePhoneNumber).toBe(null)
      expect(userProfile.emailVerified).toBe(false)
      expect(userProfile.mobilePhoneNumberVerified).toBe(false)
      expect(userProfile.emailStatus).toBe(DataStatus.EMPTY)
      expect(userProfile.mobileStatus).toBe(DataStatus.EMPTY)

      // Assert that islyklar api is called
      expect(islyklarApi.islyklarPut).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: '',
          mobile: '',
        },
      })
    })

    it('PATCH /v2/me should return 200 and create islyklar profile when it does not exist', async () => {
      // Arrange
      islyklarApi.islyklarGet = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) =>
          reject({
            status: 404,
          }),
        )
      })

      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(islyklarApi.islyklarPut).not.toBeCalled()
      expect(islyklarApi.islyklarPost).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: newEmail,
          mobile: formattedNewPhoneNumber,
        },
      })
    })

    it('PATCH /v2/me should return 200 and should call the islyklar put method and not post', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(islyklarApi.islyklarPost).not.toBeCalled()
      expect(islyklarApi.islyklarPut).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: newEmail,
          mobile: formattedNewPhoneNumber,
        },
      })
    })

    it('PATCH /v2/me should return 200 and should call the islyklar put method with new email and current mobilePhoneNumber', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(islyklarApi.islyklarPost).not.toBeCalled()
      expect(islyklarApi.islyklarPut).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: newEmail,
          mobile: testUserProfile.mobilePhoneNumber,
        },
      })
    })

    it('PATCH /v2/me should return 200 and should call the islyklar put method with new mobilePhoneNumber and current email', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(islyklarApi.islyklarPost).not.toBeCalled()
      expect(islyklarApi.islyklarPut).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: testUserProfile.email,
          mobile: formattedNewPhoneNumber,
        },
      })
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

    it('POST /v2/me/nudge should return 200 and update the lastNudge field when user confirms nudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.post('/v2/me/nudge')

      // Assert
      expect(res.status).toEqual(200)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.lastNudge).not.toBeNull()
    })

    it(`POST /v2/me/nudge should return 200 and update the lastNudge field when user confirms nudge`, async () => {
      // Act
      const res = await server.post('/v2/me/nudge')

      // Assert
      expect(res.status).toEqual(200)

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
