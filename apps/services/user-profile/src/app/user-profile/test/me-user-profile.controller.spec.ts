import { getModelToken } from '@nestjs/sequelize'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import faker from 'faker'
import request, { SuperTest, Test } from 'supertest'

import { ApiScope, UserProfileScope } from '@island.is/auth/scopes'
import { setupApp, TestApp } from '@island.is/testing/nest'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
  createVerificationCode,
} from '@island.is/testing/fixtures'
import { DelegationsApi } from '@island.is/clients/auth/delegation-api'

import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfile } from '../models/userProfile.model'
import { VerificationService } from '../verification.service'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { SmsVerification } from '../models/smsVerification.model'
import { EmailVerification } from '../models/emailVerification.model'
import { DataStatus } from '../types/dataStatusTypes'
import { NudgeType } from '../../types/nudge-type'
import { PostNudgeDto } from '../dto/post-nudge.dto'
import { NUDGE_INTERVAL, SKIP_INTERVAL } from '../user-profile.service'
import { ActorProfile } from '../models/actor-profile.model'
import { ClientType } from '../../types/ClientType'

type StatusFieldType = 'emailStatus' | 'mobileStatus'

const MIGRATION_DATE = new Date('2024-05-10')

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
        email: testUserProfile.email,
        emailVerified: true,
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
        email: testUserProfile.email,
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
        email: testUserProfile.email,
        emailVerified: true,
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
        email: testUserProfile.email,
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
          nextNudge: lastNudge ? addMonths(lastNudge, nextNudgeLength) : null,
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
    let app = null
    let server = null
    let fixtureFactory = null

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
    })

    afterEach(async () => {
      fixtureFactory = null
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
      })

      expect(userProfile.email).toBe(newEmail)
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
      })

      expect(userProfile.email).toBe(newEmail)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, SKIP_INTERVAL).toString(),
      )
    })

    it('PATCH /v2/me should update phone and push nextNudge by 1 months ', async () => {
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emailVerified: false,
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
      })

      expect(userProfile.email).toBe(null)
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
        emailVerified: true,
        emailStatus: DataStatus.VERIFIED,
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
      })

      expect(userProfile.email).toBe(testUserProfile.email)
      expect(userProfile.mobilePhoneNumber).toBe(null)
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, NUDGE_INTERVAL).toString(),
      )
    })
  })

  describe('PATCH user-profile', () => {
    let app = null
    let server = null
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
      expect(userProfile.nextNudge.toString()).toBe(
        addMonths(userProfile.lastNudge, NUDGE_INTERVAL).toString(),
      )
    })

    it('PATCH /v2/me should return 200', async () => {
      // Act
      const res = await server.patch('/v2/me').send({
        email: newEmail,
        emailVerificationCode: emailVerificationCode,
        mobilePhoneNumber: formattedNewPhoneNumber,
        mobilePhoneNumberVerificationCode: smsVerificationCode,
      })

      // Assert
      expect(res.status).toEqual(200)
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
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(userProfile.emailNotifications).toBe(false)
      expect(userProfile.email).toBe(newEmail)
      expect(userProfile.emailVerified).toBe(true)
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
          [field]: DataStatus.NOT_DEFINED,
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
          where: { nationalId: testUserProfile.nationalId },
        })
        expect(userProfile[field]).toBe(DataStatus.EMPTY)
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
          [field]: dbStatus,
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
          where: { nationalId: testUserProfile.nationalId },
        })
        expect(userProfile[field]).toBe(dbStatus)
      },
    )
  })

  describe('GET v2/me/actor-profiles', () => {
    let app: TestApp = null
    let server: SuperTest<Test> = null
    let fixtureFactory: FixtureFactory = null
    let userProfileModel: typeof UserProfile = null
    let actorProfileModel: typeof ActorProfile = null
    let delegationsApi: DelegationsApi = null

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
            },
            {
              toNationalId: testUserProfile.nationalId,
              fromNationalId: testNationalId2,
              subjectId: null,
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
      })

      // Act
      const res = await server.get('/v2/me/actor-profiles')

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body.data[0]).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
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
    let app: TestApp = null
    let server: SuperTest<Test> = null
    let fixtureFactory: FixtureFactory = null
    let userProfileModel: typeof UserProfile = null
    let delegationPreferenceModel: typeof ActorProfile = null
    let delegationsApi: DelegationsApi = null
    const testNationalId1 = createNationalId('person')

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

    it('should create new actor profile for delegation if it does not exist', async () => {
      // Act
      const res = await server
        .patch('/v2/me/actor-profiles/.from-national-id')
        .set('X-Param-From-National-Id', testNationalId1)
        .send({ emailNotifications: false })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
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
        .send({ emailNotifications: false })

      // Assert
      expect(res.status).toEqual(200)
      expect(res.body).toStrictEqual({
        fromNationalId: testNationalId1,
        emailNotifications: false,
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
    })

    it('should throw no content exception if delegation is not found', async () => {
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

  describe('POST /v2/me/device-tokens', () => {
    const newDeviceToken = 'new-device-token-123'
    const testUser = createCurrentUser({
      nationalId: testUserProfile.nationalId,
      scope: [UserProfileScope.write],
    })

    let app: TestApp = null
    let server: SuperTest<Test> = null
    let fixtureFactory: FixtureFactory = null

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: testUser,
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
    })

    it('should successfully add a new device token', async () => {
      // Act
      const res = await server
        .post('/v2/me/device-tokens')
        .send({ deviceToken: newDeviceToken })

      // Assert
      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        nationalId: testUser.nationalId,
        deviceToken: newDeviceToken,
      })
    })

    it('should return 403 when user does not have write scope', async () => {
      // Create a new app instance without write scope
      await app.cleanUp()
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [UserProfileScope.read], // Only read scope, no write scope
        }),
      })
      server = request(app.getHttpServer())

      // Act
      const res = await server
        .post('/v2/me/device-tokens')
        .send({ deviceToken: newDeviceToken })

      // Assert
      expect(res.status).toBe(403)
      expect(res.body).toMatchObject({
        status: 403,
        title: 'Forbidden',
        detail: 'Forbidden resource',
        type: 'https://httpstatuses.org/403',
      })
    })

    it('should return 400 when deviceToken is missing from request body', async () => {
      // Reset app to have write scope
      await app.cleanUp()
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: testUser,
      })
      server = request(app.getHttpServer())

      // Act
      const res = await server.post('/v2/me/device-tokens').send({}) // Empty body

      // Assert
      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
        detail: ['deviceToken must be a string'],
        type: 'https://httpstatuses.org/400',
      })
    })
  })
})
