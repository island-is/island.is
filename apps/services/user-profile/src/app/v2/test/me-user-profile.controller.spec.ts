import { getModelToken } from '@nestjs/sequelize'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import faker from 'faker'
import request, { SuperTest, Test } from 'supertest'
import { v4 as uuid } from 'uuid'

import { ApiScope, UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
  createVerificationCode,
} from '@island.is/testing/fixtures'
import { IslyklarApi, PublicUser } from '@island.is/clients/islykill'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'

import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfile } from '../../user-profile/userProfile.model'
import { VerificationService } from '../../user-profile/verification.service'
import { formatPhoneNumber } from '../../utils/format-phone-number'
import { SmsVerification } from '../../user-profile/smsVerification.model'
import { EmailVerification } from '../../user-profile/emailVerification.model'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { NudgeType } from '../../types/nudge-type'
import { PostNudgeDto } from '../dto/post-nudge.dto'
import { NUDGE_INTERVAL, SKIP_INTERVAL } from '../user-profile.service'
import { ActorProfile } from '../models/actor-profile.model'
import { ClientType } from '../../types/ClientType'
import { Emails } from '../models/emails.model'
import { UUIDV4 } from 'sequelize'

type StatusFieldType = 'emailStatus' | 'mobileStatus'

const MIGRATION_DATE = new Date('2024-05-10')

const testUserProfileEmail = {
  email: faker.internet.email(),
  primary: true,
}
const testUserProfile = {
  nationalId: createNationalId(),
  emails: [testUserProfileEmail],
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
  email: testUserProfileEmail.email,
  hash: emailVerificationCode,
}

const testSMSVerification = {
  nationalId: testUserProfile.nationalId,
  mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
  smsCode: smsVerificationCode,
}

describe('MeUserProfileController', () => {
  describe('GET /v2/me', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile

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
        mobilePhoneNumber: null,
        mobilePhoneNumberVerified: false,
        locale: null,
        documentNotifications: true,
        needsNudge: null,
      })
    })

    it('should return 200 with userprofile and no restrictions since lastNudge is newer then MIGRATION_DATE', async () => {
      // Arrange
      await fixtureFactory.createUserProfile({
        nationalId: testUserProfile.nationalId,
        emails: [
          {
            email: testUserProfileEmail.email,
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: true,
        lastNudge: addMonths(MIGRATION_DATE, 1),
        nextNudge: subMonths(new Date(), 1),
      })
      // Act
      const res = await server.get(`/v2/me`)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: testUserProfileEmail.email,
        emailVerified: true,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: true,
        locale: null,
        documentNotifications: true,
        needsNudge: true,
        isRestricted: false,
      })
    })

    it('should return 200 with userprofile and isRestricted set to true', async () => {
      // Arrange
      await fixtureFactory.createUserProfile({
        nationalId: testUserProfile.nationalId,
        emails: [
          {
            email: testUserProfileEmail.email,
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: true,
        lastNudge: subMonths(MIGRATION_DATE, 1),
        nextNudge: subMonths(new Date(), 1),
      })
      // Act
      const res = await server.get(`/v2/me`)

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        email: testUserProfileEmail.email,
        emailVerified: true,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: true,
        locale: null,
        documentNotifications: true,
        needsNudge: true,
        isRestricted: true,
      })
    })

    const currentDate = new Date()
    const expiredDate = subMonths(new Date(), NUDGE_INTERVAL + 1)

    it.each`
      verifiedField                     | isVerified | lastNudge      | nextNudgeLength   | needsNudgeExpected
      ${['email']}                      | ${true}    | ${null}        | ${NUDGE_INTERVAL} | ${true}
      ${['email']}                      | ${true}    | ${currentDate} | ${NUDGE_INTERVAL} | ${false}
      ${['email']}                      | ${true}    | ${expiredDate} | ${NUDGE_INTERVAL} | ${true}
      ${['email']}                      | ${false}   | ${null}        | ${NUDGE_INTERVAL} | ${null}
      ${['email']}                      | ${false}   | ${currentDate} | ${NUDGE_INTERVAL} | ${null}
      ${['email']}                      | ${false}   | ${expiredDate} | ${NUDGE_INTERVAL} | ${null}
      ${['email']}                      | ${false}   | ${expiredDate} | ${SKIP_INTERVAL}  | ${null}
      ${['mobilePhoneNumber']}          | ${true}    | ${null}        | ${NUDGE_INTERVAL} | ${true}
      ${['mobilePhoneNumber']}          | ${true}    | ${currentDate} | ${NUDGE_INTERVAL} | ${false}
      ${['mobilePhoneNumber']}          | ${true}    | ${expiredDate} | ${NUDGE_INTERVAL} | ${true}
      ${['mobilePhoneNumber']}          | ${false}   | ${null}        | ${NUDGE_INTERVAL} | ${null}
      ${['mobilePhoneNumber']}          | ${false}   | ${currentDate} | ${NUDGE_INTERVAL} | ${null}
      ${['mobilePhoneNumber']}          | ${false}   | ${expiredDate} | ${NUDGE_INTERVAL} | ${null}
      ${['mobilePhoneNumber']}          | ${false}   | ${expiredDate} | ${SKIP_INTERVAL}  | ${null}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${null}        | ${NUDGE_INTERVAL} | ${true}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${null}        | ${SKIP_INTERVAL}  | ${true}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${currentDate} | ${NUDGE_INTERVAL} | ${false}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${expiredDate} | ${NUDGE_INTERVAL} | ${true}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${null}        | ${NUDGE_INTERVAL} | ${null}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${currentDate} | ${NUDGE_INTERVAL} | ${null}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${expiredDate} | ${NUDGE_INTERVAL} | ${null}
      ${['email', 'mobilePhoneNumber']} | ${false}   | ${expiredDate} | ${SKIP_INTERVAL}  | ${null}
      ${null}                           | ${false}   | ${null}        | ${NUDGE_INTERVAL} | ${null}
      ${null}                           | ${false}   | ${currentDate} | ${NUDGE_INTERVAL} | ${false}
      ${null}                           | ${false}   | ${expiredDate} | ${NUDGE_INTERVAL} | ${true}
      ${['email', 'mobilePhoneNumber']} | ${true}    | ${expiredDate} | ${SKIP_INTERVAL}  | ${true}
    `(
      'should return needsNudge=$needsNudgeExpected when $verifiedField is set and lastNudge=$lastNudge',
      async ({
        verifiedField,
        isVerified,
        lastNudge,
        nextNudgeLength,
        needsNudgeExpected,
      }: {
        verifiedField: string[] | null
        isVerified: boolean
        lastNudge: Date | null
        nextNudgeLength: typeof SKIP_INTERVAL | typeof NUDGE_INTERVAL
        needsNudgeExpected: boolean | null
      }) => {
        // Arrange
        const expectedTestValues: Record<string, any> = {}
        if (verifiedField) {
          if (verifiedField.includes('email')) {
            expectedTestValues.email = testUserProfileEmail.email
            expectedTestValues.emailVerified = isVerified
          }
          if (verifiedField.includes('mobilePhoneNumber')) {
            expectedTestValues.mobilePhoneNumber =
              testUserProfile.mobilePhoneNumber
            expectedTestValues.mobilePhoneNumberVerified = isVerified
          }
        }

        await fixtureFactory
          .createUserProfile({
            nationalId: testUserProfile.nationalId,
            ...expectedTestValues,
            emails: [
              {
                email: verifiedField?.includes('email')
                  ? testUserProfileEmail.email
                  : '',
                primary: true,
                emailStatus: isVerified
                  ? DataStatus.VERIFIED
                  : DataStatus.NOT_VERIFIED,
              },
            ],
            lastNudge,
            nextNudge: lastNudge ? addMonths(lastNudge, nextNudgeLength) : null,
          })
          .catch((err) => {
            throw new Error(`Failed to create user profile: ${err}`)
          })

        // Act
        const res = await server.get(
          `/v2/me?clientType=${ClientType.FIRST_PARTY}`,
        )

        // Assert
        expect(res.status).toEqual(200)

        expect(res.body).toMatchObject({
          nationalId: testUserProfile.nationalId,
          documentNotifications: true,
          ...expectedTestValues,
          needsNudge: needsNudgeExpected,
          emailNotifications: true,
        })
      },
    )
  })

  describe('PATCH user-profile - nudge dates', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let islyklarApi = null

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
      fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createEmailVerification({
        ...testEmailVerification,
        email: newEmail,
      })
      await fixtureFactory.createSmsVerification({
        ...testSMSVerification,
        mobilePhoneNumber: newPhoneNumber,
      })

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
        email: testUserProfileEmail.email,
        mobile: testUserProfile.mobilePhoneNumber,
      })
    })

    afterEach(async () => {
      await app.cleanUp()
    })

    it('PATCH /v2/me should update email and phone and push nextNudge by 6 months ', async () => {
      await fixtureFactory.createUserProfile(testUserProfile)

      const res = await server.patch('/v2/me').send({
        email: newEmail,
        mobilePhoneNumber: formattedNewPhoneNumber,
        emailVerificationCode: emailVerificationCode,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)

      // Assert Db records
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

      expect(userProfile.emails?.[0]?.email).toBe(newEmail)
      expect(userProfile.mobilePhoneNumber).toBe(formattedNewPhoneNumber)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, NUDGE_INTERVAL).toString(),
      )
    })

    it('PATCH /v2/me should update email and push nextNudge by 1 month ', async () => {
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        mobilePhoneNumberVerified: false,
      })

      const res = await server.patch('/v2/me').send({
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)

      // Assert Db records
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

      expect(userProfile.emails?.[0]?.email).toBe(newEmail)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, SKIP_INTERVAL).toString(),
      )
    })

    it('PATCH /v2/me should update phone and push nextNudge by 1 months ', async () => {
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [
          {
            email: testUserProfileEmail.email,
            emailStatus: DataStatus.NOT_VERIFIED,
            primary: true,
          },
        ],
      })

      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)

      // Assert Db records
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

      expect(userProfile.mobilePhoneNumber).toBe(formattedNewPhoneNumber)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, SKIP_INTERVAL).toString(),
      )
    })

    it('PATCH /v2/me should empty email and push nextNudge by 6 months ', async () => {
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        mobilePhoneNumberVerified: true,
        mobileStatus: DataStatus.VERIFIED,
      })

      const res = await server.patch('/v2/me').send({
        email: '',
      })

      // Assert
      expect(res.status).toEqual(200)

      // Assert Db records
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

      expect(userProfile.emails?.[0]?.email).toBe(null)
      expect(userProfile.mobilePhoneNumber).toBe(
        testUserProfile.mobilePhoneNumber,
      )
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, NUDGE_INTERVAL).toString(),
      )
    })

    it('PATCH /v2/me should empty phoneNumber and push nextNudge by 6 month ', async () => {
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [
          {
            ...testUserProfileEmail,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
      })

      const res = await server.patch('/v2/me').send({
        mobilePhoneNumber: '',
      })
      // Assert
      expect(res.status).toEqual(200)

      // Assert Db records
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

      expect(userProfile.emails?.[0]?.email).toBe(testUserProfileEmail.email)
      expect(userProfile.mobilePhoneNumber).toBe(null)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, NUDGE_INTERVAL).toString(),
      )
    })
  })

  describe('PATCH user-profile', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let islyklarApi: IslyklarApi
    let confirmSmsSpy: jest.SpyInstance

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
        email: testUserProfileEmail.email,
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
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        include: {
          model: Emails,
          as: 'emails',
          required: false,
          where: {
            primary: true,
          },
        },
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile?.emails?.[0].email).toBe(newEmail)
      expect(userProfile.mobilePhoneNumber).toBe(formattedNewPhoneNumber)
      expect(userProfile.mobilePhoneNumberVerified).toBe(true)
      expect(userProfile?.emails?.[0].emailStatus).toBe(DataStatus.VERIFIED)
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
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        include: {
          model: Emails,
          as: 'emails',
          required: false,
          where: {
            primary: true,
          },
        },
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile?.emails?.[0].email).toBe(newEmail)
      expect(userProfile?.emails?.[0].emailStatus).toBe(DataStatus.VERIFIED)
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
        include: {
          model: Emails,
          as: 'emails',
          required: false,
          where: {
            primary: true,
          },
        },
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile?.emails?.[0].email).toBe(testUserProfileEmail.email)

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
      })

      // Assert Db records
      const userProfileModel = await app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        include: {
          model: Emails,
          as: 'emails',
          required: false,
          where: {
            primary: true,
          },
        },
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile?.emails?.[0].email).toBe(null)
      expect(userProfile.mobilePhoneNumber).toBe(null)
      expect(userProfile.mobilePhoneNumberVerified).toBe(false)
      expect(userProfile?.emails?.[0].emailStatus).toBe(DataStatus.EMPTY)
      expect(userProfile.mobileStatus).toBe(DataStatus.EMPTY)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, NUDGE_INTERVAL).toString(),
      )

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
          email: testUserProfileEmail.email,
          mobile: formattedNewPhoneNumber,
        },
      })
    })

    it('PATCH /v2/me should return 200 and update emailNotifications', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        emailNotifications: false,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        emailNotifications: false,
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.emailNotifications).toBe(false)

      // Assert that islyklar api is called
      expect(islyklarApi.islyklarPut).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: testUserProfileEmail.email,
          mobile: testUserProfile.mobilePhoneNumber,
          canNudge: false,
        },
      })
    })

    it('PATCH /v2/me should return 200 and update emailNotifications and email', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        emailNotifications: false,
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        nationalId: testUserProfile.nationalId,
        emailNotifications: false,
        email: newEmail,
        emailVerified: true,
      })

      // Assert Db records
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        include: {
          model: Emails,
          as: 'emails',
          required: false,
          where: {
            primary: true,
          },
        },
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.emailNotifications).toBe(false)
      expect(userProfile?.emails?.[0].email).toBe(newEmail)
      expect(userProfile?.emails?.[0].emailStatus).toBe(DataStatus.VERIFIED)

      // Assert that islyklar api is called
      expect(islyklarApi.islyklarPut).toBeCalledWith({
        user: {
          ssn: testUserProfile.nationalId,
          email: newEmail,
          mobile: testUserProfile.mobilePhoneNumber,
          canNudge: false,
        },
      })
    })
  })

  describe('Nudge confirmation', () => {
    let app: TestApp
    let server: SuperTest<Test>

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

    it('POST /v2/me/nudge should return 200 and update the lastNudge and nextNudge field when user confirms nudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.post('/v2/me/nudge').send({
        nudgeType: NudgeType.NUDGE,
      } as PostNudgeDto)

      // Assert
      expect(res.status).toEqual(200)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.lastNudge).not.toBeNull()
      expect(userProfile.nextNudge).not.toBeNull()
    })

    it(`POST /v2/me/nudge should return 200 and update the lastNudge field when user confirms nudge`, async () => {
      // Act
      const res = await server.post('/v2/me/nudge').send({
        nudgeType: NudgeType.NUDGE,
      } as PostNudgeDto)

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

    it('POST /v2/me/nudge with nudgeType=NudgeType.SKIP_EMAIL should return 200 and update the lastNudge and set nextNudge to 1 month after lastNudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.post(`/v2/me/nudge`).send({
        nudgeType: NudgeType.SKIP_EMAIL,
      } as PostNudgeDto)

      // Assert
      expect(res.status).toEqual(200)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.lastNudge).not.toBeNull()
      expect(userProfile.nextNudge).toEqual(addMonths(userProfile.lastNudge, 1))
    })

    it('POST /v2/me/nudge with  nudgeType=NudgeType.SKIP_PHONE should return 200 and update the lastNudge and set nextNudge to 1 month after lastNudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.post(`/v2/me/nudge`).send({
        nudgeType: NudgeType.SKIP_PHONE,
      } as PostNudgeDto)

      // Assert
      expect(res.status).toEqual(200)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.lastNudge).not.toBeNull()
      expect(userProfile.nextNudge).toEqual(addMonths(userProfile.lastNudge, 1))
    })

    it('POST /v2/me/nudge with nudgeType=NudgeType.NUDGE should return 200 and update the lastNudge and set nextNudge to 6 month after lastNudge', async () => {
      // Arrange
      const fixtureFactory = new FixtureFactory(app)

      await fixtureFactory.createUserProfile(testUserProfile)

      // Act
      const res = await server.post(`/v2/me/nudge`).send({
        nudgeType: NudgeType.NUDGE,
      } as PostNudgeDto)

      // Assert
      expect(res.status).toEqual(200)

      // Assert that lastNudge is updated
      const userProfileModel = app.get(getModelToken(UserProfile))
      const userProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.lastNudge).not.toBeNull()
      expect(userProfile.nextNudge).toEqual(addMonths(userProfile.lastNudge, 6))
    })

    it.each`
      nudgeType          | field
      ${NudgeType.NUDGE} | ${'emailStatus'}
      ${NudgeType.NUDGE} | ${'mobileStatus'}
    `(
      'POST /v2/me/nudge with nudgeType=$nudgeType should only update $field to EMPTY when it is NOT_DEFINED',
      async ({
        nudgeType,
        field,
      }: {
        nudgeType: NudgeType
        field: StatusFieldType
      }) => {
        // Arrange
        const fixtureFactory = new FixtureFactory(app)
        await fixtureFactory.createUserProfile({
          ...testUserProfile,
          emails: [
            {
              email: testUserProfileEmail.email,
              primary: true,
              emailStatus: DataStatus.NOT_DEFINED,
            },
          ],
          mobileStatus: DataStatus.NOT_DEFINED,
        })

        // Act
        const res = await server.post(`/v2/me/nudge`).send({
          nudgeType,
        } as PostNudgeDto)

        // Assert
        expect(res.status).toEqual(200)

        // Assert that $field status is updated
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          include: [
            {
              model: Emails,
              as: 'emails',
              required: false,
              where: {
                primary: true,
              },
            },
          ],
          where: { nationalId: testUserProfile.nationalId },
        })
        if (field === 'mobileStatus') {
          expect(userProfile.mobileStatus).toBe(DataStatus.EMPTY)
        } else {
          expect(userProfile.emails?.[0].emailStatus).toBe(DataStatus.EMPTY)
        }
      },
    )

    it.each`
      nudgeType               | field             | dbStatus
      ${NudgeType.SKIP_EMAIL} | ${'emailStatus'}  | ${DataStatus.VERIFIED}
      ${NudgeType.SKIP_EMAIL} | ${'emailStatus'}  | ${DataStatus.NOT_VERIFIED}
      ${NudgeType.SKIP_PHONE} | ${'mobileStatus'} | ${DataStatus.VERIFIED}
      ${NudgeType.SKIP_PHONE} | ${'mobileStatus'} | ${DataStatus.NOT_VERIFIED}
      ${NudgeType.NUDGE}      | ${'emailStatus'}  | ${DataStatus.VERIFIED}
      ${NudgeType.NUDGE}      | ${'emailStatus'}  | ${DataStatus.NOT_VERIFIED}
      ${NudgeType.NUDGE}      | ${'mobileStatus'} | ${DataStatus.VERIFIED}
      ${NudgeType.NUDGE}      | ${'mobileStatus'} | ${DataStatus.NOT_VERIFIED}
    `(
      `POST /v2/me/nudge with nudgeType=$nudgeType should not update $field to EMPTY when db status is $dbStatus`,
      async ({
        nudgeType,
        field,
        dbStatus,
      }: {
        nudgeType: NudgeType
        field: StatusFieldType
        dbStatus: DataStatus
      }) => {
        // Arrange
        const fixtureFactory = new FixtureFactory(app)
        await fixtureFactory.createUserProfile({
          ...testUserProfile,
          emails: [
            {
              ...testUserProfileEmail,
              emailStatus:
                field === 'emailStatus' ? dbStatus : DataStatus.NOT_DEFINED,
            },
          ],
          ...(field === 'mobileStatus' ? { mobileStatus: dbStatus } : {}),
        })

        // Act
        const res = await server.post(`/v2/me/nudge`).send({
          nudgeType,
        } as PostNudgeDto)

        // Assert
        expect(res.status).toEqual(200)

        // Assert that $field status is not updated
        const userProfileModel = app.get(getModelToken(UserProfile))
        const userProfile = await userProfileModel.findOne({
          include: [
            {
              model: Emails,
              as: 'emails',
              required: false,
              where: {
                primary: true,
              },
            },
          ],
          where: { nationalId: testUserProfile.nationalId },
        })
        if (field === 'mobileStatus') {
          expect(userProfile.mobileStatus).toBe(dbStatus)
        } else if (field === 'emailStatus') {
          expect(userProfile.emails?.[0].emailStatus).toBe(dbStatus)
        }
      },
    )
  })

  describe('GET v2/me/actor-profiles', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let actorProfileModel: typeof ActorProfile
    let delegationsApi: DelegationsApi
    const testEmailsId = uuid()

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [ApiScope.internal],
        }),
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      delegationsApi = app.get(DelegationsApi)
      userProfileModel = app.get(getModelToken(UserProfile))
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
    it('should return 200 and the actor profile for each delegation', async () => {
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
              subjectId: null,
              type: 'delegation',
            },
            {
              toNationalId: testUserProfile.nationalId,
              fromNationalId: testNationalId2,
              subjectId: null,
              type: 'delegation',
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
        emailsId: testEmailsId,
      })

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.data[0]).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: testEmailsId,
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

  describe('PATCH v2/me/actor-profiles/.from-national-id', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let delegationPreferenceModel: typeof ActorProfile
    let emailsModel: typeof Emails
    let delegationsApi: DelegationsApi
    const testNationalId1 = createNationalId('person')
    const testEmailsId = uuid()

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [ApiScope.internal],
        }),
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      delegationsApi = app.get(DelegationsApi)
      userProfileModel = app.get(getModelToken(UserProfile))
      delegationPreferenceModel = app.get(getModelToken(ActorProfile))
      emailsModel = app.get(getModelToken(Emails))
    })

    beforeEach(async () => {
      await userProfileModel.destroy({
        truncate: true,
      })
      await delegationPreferenceModel.destroy({
        truncate: true,
      })

      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockResolvedValue({
          data: [
            {
              toNationalId: testUserProfile.nationalId,
              fromNationalId: testNationalId1,
              subjectId: null,
              type: 'delegation',
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
          totalCount: 1,
        })
    })

    afterEach(async () => {
      await emailsModel.destroy({
        truncate: true,
        force: true,
        cascade: true,
      })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should create new actor profile for delegation if it does not exist', async () => {
      // Act
      const res = await server
        .patch('/v2/me/actor-profiles/.from-national-id')
        .set('X-Param-From-National-Id', testNationalId1)
        .send({ emailNotifications: false })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: expect.any(String),
      })

      const actorProfile = await delegationPreferenceModel.findAll({
        where: {
          toNationalId: testUserProfile.nationalId,
          fromNationalId: testNationalId1,
        },
      })

      expect(actorProfile).toHaveLength(1)
      expect(actorProfile[0]).not.toBeNull()
      expect(actorProfile[0].emailNotifications).toBe(false)
      expect(
        delegationsApi.delegationsControllerGetDelegationRecords,
      ).toHaveBeenCalledWith({
        xQueryNationalId: testUserProfile.nationalId,
        scope: '@island.is/documents',
        direction: 'incoming',
      })
    })

    it('should update existing actor profile', async () => {
      const testEmailsId2 = uuid()
      // Arrange
      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
        emailNotifications: true,
        emailsId: testEmailsId2,
      })

      // Act
      const res = await server
        .patch('/v2/me/actor-profiles/.from-national-id')
        .set('X-Param-From-National-Id', testNationalId1)
        .send({ emailNotifications: false, emailsId: testEmailsId2 })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: testEmailsId2,
      })

      const actorProfile = await delegationPreferenceModel.findAll({
        where: {
          toNationalId: testUserProfile.nationalId,
          fromNationalId: testNationalId1,
        },
      })

      expect(actorProfile).toHaveLength(1)
      expect(actorProfile[0]).not.toBeNull()
      expect(actorProfile[0].emailNotifications).toBe(false)
      expect(actorProfile[0].emailsId).toBe(testEmailsId2)
    })

    it('should create new actor profile with emailsId', async () => {
      // Act
      const res = await server
        .patch('/v2/me/actor-profiles/.from-national-id')
        .set('X-Param-From-National-Id', testNationalId1)
        .send({
          emailNotifications: false,
          emailsId: testEmailsId,
        })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: testEmailsId,
      })

      const actorProfile = await delegationPreferenceModel.findAll({
        where: {
          toNationalId: testUserProfile.nationalId,
          fromNationalId: testNationalId1,
        },
      })

      expect(actorProfile).toHaveLength(1)
      expect(actorProfile[0]).not.toBeNull()
      expect(actorProfile[0].emailNotifications).toBe(false)
      expect(actorProfile[0].emailsId).toBe(testEmailsId)
    })

    it('should change emailsId', async () => {
      // Arrange
      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
        emailNotifications: true,
      })

      // Act
      const res = await server
        .patch('/v2/me/actor-profiles/.from-national-id')
        .set('X-Param-From-National-Id', testNationalId1)
        .send({
          emailsId: testEmailsId,
        })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: true,
        emailsId: testEmailsId,
      })

      const actorProfile = await delegationPreferenceModel.findAll({
        where: {
          toNationalId: testUserProfile.nationalId,
          fromNationalId: testNationalId1,
        },
      })

      expect(actorProfile).toHaveLength(1)
      expect(actorProfile[0]).not.toBeNull()
      expect(actorProfile[0].emailNotifications).toBe(true)
      expect(actorProfile[0].emailsId).toBe(testEmailsId)
    })

    it('should throw no content exception if delegation is not found', async () => {
      // Arrange
      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockResolvedValue({
          data: [], // No delegations
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
          totalCount: 1,
        })

      // Act
      const res = await server
        .patch('/v2/me/actor-profiles/.from-national-id')
        .set('X-Param-From-National-Id', testNationalId1)
        .send({ emailNotifications: false })

      // Assert
      expect(res.status).toEqual(204)
    })
  })

  describe('GET v2/me/actor-profile', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let actorProfileModel: typeof ActorProfile
    let delegationsApi: DelegationsApi
    let emailsModel: typeof Emails
    const testEmailsId = uuid()
    const testNationalId1 = createNationalId('person')

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [ApiScope.internal],
          actor: {
            nationalId: testNationalId1,
          },
        }),
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      delegationsApi = app.get(DelegationsApi)
      userProfileModel = app.get(getModelToken(UserProfile))
      actorProfileModel = app.get(getModelToken(ActorProfile))
      emailsModel = app.get(getModelToken(Emails))
    })

    beforeEach(async () => {
      await userProfileModel.destroy({
        truncate: true,
      })
      await actorProfileModel.destroy({
        truncate: true,
      })
      await emailsModel.destroy({
        truncate: true,
        force: true,
        cascade: true,
      })

      // Mock delegations API to return a delegation between the test user and testNationalId1
      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockResolvedValue({
          data: [
            {
              toNationalId: testNationalId1,
              fromNationalId: testUserProfile.nationalId,
              subjectId: null,
              type: 'delegation',
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
          totalCount: 1,
        })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should return actor profile with all required fields', async () => {
      // Arrange
      // Create a user profile for the actor with a verified email
      try {
        const userProfile = await fixtureFactory.createUserProfile({
          nationalId: testNationalId1,
          emails: [
            {
              email: 'test@example.com',
              primary: true,
              emailStatus: DataStatus.VERIFIED,
            },
          ],
        })

        const nextNudgeDate = subMonths(new Date(), 1) // 1 month ago, to test needsNudge=true

        // Create the actor profile for the relationship
        await actorProfileModel.create({
          id: uuid(),
          toNationalId: testNationalId1,
          fromNationalId: testUserProfile.nationalId,
          emailNotifications: true,
          emailsId: userProfile.emails?.[0].id,
          nextNudge: nextNudgeDate,
        })
      } catch (error) {
        console.error('Error creating actor profile:', error)
      }

      // Act
      const res = await server.get('/v2/me/actor-profile')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: 'test@example.com',
        emailStatus: DataStatus.VERIFIED,
        emailVerified: true,
        needsNudge: true, // Should be true because nextNudge is in the past
        actorNationalId: testUserProfile.nationalId,
        emailNotifications: true,
      })
    })

    it('should return actor profile with unverified email', async () => {
      // Arrange
      try {
        // Create a user profile for the actor with an unverified email
        const userProfile = await fixtureFactory.createUserProfile({
          nationalId: testNationalId1,
          emails: [
            {
              email: 'unverified@example.com',
              primary: true,
              emailStatus: DataStatus.NOT_VERIFIED,
            },
          ],
        })

        const nextNudgeDate = addMonths(new Date(), 1) // 1 month in future, to test needsNudge=false

        // Create the actor profile for the relationship
        await actorProfileModel.create({
          id: uuid(),
          toNationalId: testNationalId1,
          fromNationalId: testUserProfile.nationalId,
          emailNotifications: false,
          emailsId: userProfile.emails?.[0].id,
          nextNudge: nextNudgeDate,
        })
      } catch (error) {
        console.error('Error creating actor profile:', error)
      }

      // Act
      const res = await server.get('/v2/me/actor-profile')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: 'unverified@example.com',
        emailStatus: DataStatus.NOT_VERIFIED,
        emailVerified: false,
        needsNudge: null, // nextNudge is in the future and there is no verified contact info
        actorNationalId: testUserProfile.nationalId,
        emailNotifications: false,
      })
    })

    it('should handle actor profile with no email connected', async () => {
      // Arrange
      // Create an actor profile without an emailsId
      await actorProfileModel.create({
        id: uuid(),
        toNationalId: testNationalId1,
        fromNationalId: testUserProfile.nationalId,
        emailNotifications: true,
      })

      // Act
      const res = await server.get('/v2/me/actor-profile')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: null,
        emailStatus: DataStatus.NOT_DEFINED,
        emailVerified: false,
        needsNudge: null, // No nextNudge, no email, no phone, so result should be null
        actorNationalId: testUserProfile.nationalId,
        emailNotifications: true,
      })
    })

    it('should return 400 when actor profile does not exist', async () => {
      // No actor profile in the database

      // Act
      const res = await server.get('/v2/me/actor-profile')

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        title: 'Bad Request',
        status: 400,
        detail: 'Actor profile does not exist',
      })
    })

    it('should return 400 when delegation does not exist', async () => {
      // Mock delegations API to return empty result
      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockResolvedValueOnce({
          data: [], // No delegations
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
          totalCount: 0,
        })

      try {
        // Create the actor profile directly without creating a user profile first
        // This reduces the number of database operations
        await actorProfileModel.create({
          id: uuid(),
          toNationalId: testNationalId1,
          fromNationalId: testUserProfile.nationalId,
          emailNotifications: true,
        })
      } catch (error) {
        console.error('Error creating actor profile:', error)
        // You might want to fail the test if this creation fails
        // throw error;
      }

      // Act
      const res = await server.get('/v2/me/actor-profile')

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        title: 'Bad Request',
        status: 400,
        detail: 'Delegation does not exist',
      })
    })
  })

  describe('GET v2/me/actor-profile - user without actor', () => {
    let appWithNoActor: TestApp
    let serverWithNoActor: SuperTest<Test>

    beforeAll(async () => {
      appWithNoActor = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [ApiScope.internal],
          // No actor property
        }),
      })

      serverWithNoActor = request(appWithNoActor.getHttpServer())
    })

    afterAll(async () => {
      await appWithNoActor.cleanUp()
    })

    it('should return 400 when user does not have an actor property', async () => {
      // Act
      const res = await serverWithNoActor.get('/v2/me/actor-profile')

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        title: 'Bad Request',
        status: 400,
        detail: 'User has no actor profile',
      })
    })
  })
})
