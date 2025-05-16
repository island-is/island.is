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

      const userProfile = await fixtureFactory.createUserProfile({
        nationalId: testNationalId1,
        emails: [],
      })

      const email1 = await fixtureFactory.createEmail({
        email: 'test@example.com',
        primary: true,
        emailStatus: DataStatus.VERIFIED,
        nationalId: testNationalId1,
      })

      // only create actor profile for one of the delegations
      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: email1.id,
      })

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.data[0]).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: email1.id,
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

    it('should return an empty array when there are no delegations', async () => {
      // Arrange
      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockResolvedValue({
          data: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
          totalCount: 0,
        })

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toEqual({
        data: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
        },
      })
    })

    it('should return actor profiles with multiple profiles having emailsId', async () => {
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

      // Create user profiles and emails for both delegations
      const userProfile1 = await fixtureFactory.createUserProfile({
        nationalId: testNationalId1,
        emails: [],
      })

      const email1 = await fixtureFactory.createEmail({
        email: 'test1@example.com',
        primary: true,
        emailStatus: DataStatus.VERIFIED,
        nationalId: testNationalId1,
      })

      const userProfile2 = await fixtureFactory.createUserProfile({
        nationalId: testNationalId2,
        emails: [],
      })

      const email2 = await fixtureFactory.createEmail({
        email: 'test2@example.com',
        primary: true,
        emailStatus: DataStatus.VERIFIED,
        nationalId: testNationalId2,
      })

      // Create actor profiles for both delegations
      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: email1.id,
      })

      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId2,
        emailNotifications: true,
        emailsId: email2.id,
      })

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.data).toHaveLength(2)
      expect(res.body.data[0]).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: email1.id,
      })
      expect(res.body.data[1]).toStrictEqual({
        fromNationalId: testNationalId2,
        emailNotifications: true,
        emailsId: email2.id,
      })
    })

    it('should handle delegations API errors gracefully', async () => {
      // Arrange
      jest
        .spyOn(delegationsApi, 'delegationsControllerGetDelegationRecords')
        .mockRejectedValue(new Error('Service unavailable'))

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(500) // Should return internal server error
    })

    it('should return actor profiles with different delegation types', async () => {
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
              subjectId: 'document-123',
              type: 'document-delegation',
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

      // Create actor profile for the first delegation only
      await fixtureFactory.createActorProfile({
        toNationalId: testUserProfile.nationalId,
        fromNationalId: testNationalId1,
        emailNotifications: false,
      })

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.data).toHaveLength(2)
      expect(res.body.data[0]).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
        emailsId: null,
      })
      expect(res.body.data[1]).toStrictEqual({
        fromNationalId: testNationalId2,
        emailNotifications: true,
      })

      // Verify it used the correct parameters
      expect(
        delegationsApi.delegationsControllerGetDelegationRecords,
      ).toHaveBeenCalledWith({
        xQueryNationalId: testUserProfile.nationalId,
        scope: '@island.is/documents',
        direction: 'incoming',
      })
    })
  })

  describe('PATCH v2/me/emails/:emailId/primary', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let emailsModel: typeof Emails
    let originalPrimaryEmail: Emails
    let secondaryEmail: Emails

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read, UserProfileScope.write], // Need write scope
        }),
        dbType: 'postgres', // Use postgres for consistency if needed
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      userProfileModel = app.get(getModelToken(UserProfile))
      emailsModel = app.get(getModelToken(Emails))
    })

    beforeEach(async () => {
      // Clear previous data
      await emailsModel.destroy({ where: {}, truncate: true, cascade: true })
      await userProfileModel.destroy({
        where: {},
        truncate: true,
        cascade: true,
      })

      // Create user profile with two emails: one primary, one secondary
      const profile = await fixtureFactory.createUserProfile({
        nationalId: testUserProfile.nationalId,
        mobilePhoneNumber: testUserProfile.mobilePhoneNumber,
        mobilePhoneNumberVerified: true, // Assume verified phone for simpler nudge logic initially
        mobileStatus: DataStatus.VERIFIED,
        lastNudge: subMonths(new Date(), 2), // Set nudge dates in the past
        nextNudge: subMonths(new Date(), 1),
        emails: [
          {
            email: 'primary@test.com',
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
          {
            email: 'secondary@test.com',
            primary: false,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
      })
      // Add checks for profile and emails
      if (!profile || !profile.emails) {
        throw new Error(
          'Test setup failed: Could not create profile with emails.',
        )
      }
      originalPrimaryEmail = profile.emails.find((e) => e.primary)!
      secondaryEmail = profile.emails.find((e) => !e.primary)!
      // Add check for found emails
      if (!originalPrimaryEmail || !secondaryEmail) {
        throw new Error(
          'Test setup failed: Could not find primary/secondary emails.',
        )
      }
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should set secondary email as primary and return 200', async () => {
      const initialProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      // Act
      const res = await server.patch(
        `/v2/me/emails/${secondaryEmail.id}/primary`,
      )

      // Assert Response
      expect(res.status).toEqual(200)
      expect(res.body.email).toBe(secondaryEmail.email) // Check if the returned profile reflects the change
      expect(res.body.emailVerified).toBe(true) // Assuming secondary was verified

      // Assert DB - New Primary Email
      const updatedSecondaryEmail = await emailsModel.findByPk(
        secondaryEmail.id,
      )
      expect(updatedSecondaryEmail?.primary).toBe(true)

      // Assert DB - Old Primary Email
      const updatedOriginalPrimaryEmail = await emailsModel.findByPk(
        originalPrimaryEmail.id,
      )
      expect(updatedOriginalPrimaryEmail?.primary).toBe(false)

      // Assert DB - Nudge Dates Updated
      const updatedProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })
      expect(updatedProfile?.lastNudge).toBeDefined() // Check definition
      expect(updatedProfile?.lastNudge).not.toEqual(initialProfile?.lastNudge) // Should be updated
      // Assuming phone and new primary email are verified, nextNudge should be NUDGE_INTERVAL months away
      if (updatedProfile?.lastNudge) {
        // Add check before using lastNudge
        const expectedNextNudge = addMonths(
          updatedProfile.lastNudge,
          NUDGE_INTERVAL,
        )
        // Compare dates ignoring milliseconds for potential minor discrepancies
        expect(
          updatedProfile?.nextNudge?.toISOString().substring(0, 22),
        ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
      }
    })

    it('should return 400 if emailId does not exist', async () => {
      const nonExistentId = uuid()
      // Act
      const res = await server.patch(`/v2/me/emails/${nonExistentId}/primary`)

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body.detail).toContain('not found for user')
    })

    it('should return 400 if emailId belongs to another user', async () => {
      // Arrange: Create another user and email
      const otherUserNationalId = createNationalId()
      const otherUserProfile = await fixtureFactory.createUserProfile({
        nationalId: otherUserNationalId,
        emails: [
          {
            email: 'other@test.com',
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
      })

      const otherUserEmail = otherUserProfile.emails?.[0]

      if (!otherUserEmail) {
        throw new Error(
          'Test setup failed: Could not find email for other user.',
        )
      }

      // Act: Try to set the other user's email as primary for the current user
      const res = await server.patch(
        `/v2/me/emails/${otherUserEmail.id}/primary`,
      )

      // Assert
      expect(res.status).toEqual(400)
      expect(res.body.detail).toContain('not found for user')
    })

    it('should recalculate nextNudge to SKIP_INTERVAL if new primary email is unverified', async () => {
      // Arrange: Update secondary email to be unverified
      await emailsModel.update(
        { emailStatus: DataStatus.NOT_VERIFIED },
        { where: { id: secondaryEmail.id } },
      )

      const initialProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      // Act
      const res = await server.patch(
        `/v2/me/emails/${secondaryEmail.id}/primary`,
      )

      // Assert Response
      expect(res.status).toEqual(200)
      expect(res.body.emailVerified).toBe(false)

      // Assert DB - Nudge Dates Updated for SKIP_INTERVAL
      const updatedProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })
      expect(updatedProfile?.lastNudge).toBeDefined() // Check definition
      expect(updatedProfile?.lastNudge).not.toEqual(initialProfile?.lastNudge)
      if (updatedProfile?.lastNudge) {
        // Add check before using lastNudge
        const expectedNextNudge = addMonths(
          updatedProfile.lastNudge,
          SKIP_INTERVAL,
        ) // Expect skip interval
        expect(
          updatedProfile?.nextNudge?.toISOString().substring(0, 22),
        ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
      }
    })

    it('should recalculate nextNudge to NUDGE_INTERVAL if new primary email and mobile are verified', async () => {
      // Arrange: Ensure secondary email is verified and mobile is verified
      await emailsModel.update(
        { emailStatus: DataStatus.VERIFIED },
        { where: { id: secondaryEmail.id } },
      )
      await userProfileModel.update(
        {
          mobilePhoneNumber: '1234567',
          mobilePhoneNumberVerified: true,
          mobileStatus: DataStatus.VERIFIED,
        },
        { where: { nationalId: testUserProfile.nationalId } },
      )

      const initialProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      // Act
      const res = await server.patch(
        `/v2/me/emails/${secondaryEmail.id}/primary`,
      )

      // Assert Response
      expect(res.status).toEqual(200)
      expect(res.body.emailVerified).toBe(true)

      // Assert DB - Nudge Dates Updated for NUDGE_INTERVAL
      const updatedProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })
      expect(updatedProfile?.lastNudge).toBeDefined()
      expect(updatedProfile?.lastNudge).not.toEqual(initialProfile?.lastNudge)
      if (updatedProfile?.lastNudge) {
        const expectedNextNudge = addMonths(
          updatedProfile.lastNudge,
          NUDGE_INTERVAL,
        ) // Expect nudge interval
        expect(
          updatedProfile?.nextNudge?.toISOString().substring(0, 22),
        ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
      }
    })

    it('should recalculate nextNudge to SKIP_INTERVAL if new primary email is verified but mobile is unverified', async () => {
      // Arrange: Ensure secondary email is verified, but mobile is not
      await emailsModel.update(
        { emailStatus: DataStatus.VERIFIED },
        { where: { id: secondaryEmail.id } },
      )
      await userProfileModel.update(
        {
          mobilePhoneNumber: '1234567',
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_VERIFIED,
        },
        { where: { nationalId: testUserProfile.nationalId } },
      )

      const initialProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      // Act
      const res = await server.patch(
        `/v2/me/emails/${secondaryEmail.id}/primary`,
      )

      // Assert Response
      expect(res.status).toEqual(200)
      expect(res.body.emailVerified).toBe(true) // Email itself is verified

      // Assert DB - Nudge Dates Updated for SKIP_INTERVAL
      const updatedProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })
      expect(updatedProfile?.lastNudge).toBeDefined()
      expect(updatedProfile?.lastNudge).not.toEqual(initialProfile?.lastNudge)
      if (updatedProfile?.lastNudge) {
        const expectedNextNudge = addMonths(
          updatedProfile.lastNudge,
          SKIP_INTERVAL,
        ) // Expect skip interval
        expect(
          updatedProfile?.nextNudge?.toISOString().substring(0, 22),
        ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
      }
    })

    it('should recalculate nextNudge to SKIP_INTERVAL if new primary email is verified but mobile status is NOT_VERIFIED', async () => {
      // Arrange: Ensure secondary email is verified, but mobile status is EMPTY
      await emailsModel.update(
        { emailStatus: DataStatus.VERIFIED },
        { where: { id: secondaryEmail.id } },
      )
      await userProfileModel.update(
        {
          mobilePhoneNumber: '1234567',
          mobilePhoneNumberVerified: false,
          mobileStatus: DataStatus.NOT_VERIFIED,
        },
        { where: { nationalId: testUserProfile.nationalId } },
      )

      const initialProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })

      // Act
      const res = await server.patch(
        `/v2/me/emails/${secondaryEmail.id}/primary`,
      )

      // Assert Response
      expect(res.status).toEqual(200)
      expect(res.body.emailVerified).toBe(true) // Email itself is verified

      // Assert DB - Nudge Dates Updated for SKIP_INTERVAL
      const updatedProfile = await userProfileModel.findOne({
        where: { nationalId: testUserProfile.nationalId },
      })
      expect(updatedProfile?.lastNudge).toBeDefined()
      expect(updatedProfile?.lastNudge).not.toEqual(initialProfile?.lastNudge)
      if (updatedProfile?.lastNudge) {
        const expectedNextNudge = addMonths(
          updatedProfile.lastNudge,
          SKIP_INTERVAL,
        ) // Expect skip interval
        expect(
          updatedProfile?.nextNudge?.toISOString().substring(0, 22),
        ).toEqual(expectedNextNudge.toISOString().substring(0, 22))
      }
    })
  })
})
