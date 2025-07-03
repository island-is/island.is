import { setup } from '../../../../test/setup'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { EmailService } from '@island.is/email-service'
import { EmailVerification } from '../emailVerification.model'
import { SmsVerification } from '../smsVerification.model'
import { SmsService } from '@island.is/nova-sms'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { UserProfileScope } from '@island.is/auth/scopes'
import { SMS_VERIFICATION_MAX_TRIES } from '../verification.service'
import { DataStatus } from '../types/dataStatusTypes'

jest.useFakeTimers()

let app: INestApplication
let emailService: EmailService
let smsService: SmsService

const mockProfile = {
  nationalId: '1234567890',
  locale: 'en',
  email: 'email@example.com',
  mobilePhoneNumber: '9876543',
}
const { email, mobilePhoneNumber, ...mockProfileNoEmailNoPhone } = mockProfile

const mockDeviceToken = {
  id: 'b3f99e48-57e6-4d30-a933-1304dad40c62',
  nationalId: mockProfile.nationalId,
  deviceToken:
    'f4XghAZSRs6L-RNWRo9-Mw:APA91bFGgAc-0rhMgeHCDvkMJBH_nU4dApG6qqATliEbPs9xXf5n7EJ7FiAjJ6NNCHMBKdqHMdLrkaFHxuShzTwmZquyCjchuVMwAGmlwdXY8vZWnVqvMVItYn5lfIH-mR7Q9FvnNlhv',
  created: '2021-12-09T12:58:04.967Z',
  modified: '2021-12-09T12:58:04.967Z',
}

beforeAll(async () => {
  app = await setup({
    override: (builder) =>
      builder.overrideGuard(IdsUserGuard).useValue(
        new MockAuthGuard({
          nationalId: mockProfile.nationalId,
          scope: [UserProfileScope.read, UserProfileScope.write],
        }),
      ),
  })

  emailService = app.get<EmailService>(EmailService)
  jest
    .spyOn(emailService, 'sendEmail')
    .mockImplementation(() => Promise.resolve(''))

  smsService = app.get<SmsService>(SmsService)
  jest.spyOn(smsService, 'sendSms').mockImplementation()
})

describe('User profile API', () => {
  describe('POST /userProfile', () => {
    it('POST /userProfile should register userProfile with no phonenumber or email', async () => {
      // Arrange

      // Act
      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfileNoEmailNoPhone)
        .expect(201)
      expect(response.body.id).toBeTruthy()
    })

    it('POST /userProfile should register userProfile and create verification', async () => {
      // Act
      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)

      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
      })
      const sutProfile = {
        ...mockProfileNoEmailNoPhone,
        email,
      }

      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve('user'))
      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send({ ...sutProfile, emailCode: verification.hash })
        .expect(201)
      expect(spy).toHaveBeenCalled()
      expect(response.body.id).toBeTruthy()

      // Assert
      expect(response.body.emailStatus).toEqual(DataStatus.VERIFIED)
      expect(verification.nationalId).toEqual(mockProfile.nationalId)
      expect(response.body).toEqual(
        expect.objectContaining({ nationalId: verification.nationalId }),
      )
      expect(response.body).toEqual(
        expect.objectContaining({ email: verification.email }),
      )
    })

    it('POST /userProfile should return conflict on existing nationalId', async () => {
      // Act
      await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfileNoEmailNoPhone)
        .expect(201)

      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfileNoEmailNoPhone)
        .expect(409)

      // Assert
      expect(response.body).toMatchObject({
        detail: `A profile with nationalId - "${mockProfile.nationalId}" already exists`,
        status: 409,
        title: 'Conflict',
        type: 'https://httpstatuses.org/409',
      })
    })

    it('POST /userProfile should return 400 bad request on invalid locale', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send({
          ...mockProfile,
          locale: 'en123',
        })
        .expect(400)

      // Assert
      expect(response.body).toMatchObject({
        detail: ['locale must be one of the following values: en, is'],
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })

    it('POST /userProrfile should return 403 forbidden on invalid authentication', async () => {
      // Act
      await request(app.getHttpServer())
        .post('/userProfile')
        .send({
          ...mockProfile,
          nationalId: '0987654321',
        })
        // Assert
        .expect(403)
    })
  })

  describe('GET /userProfile', () => {
    it('GET /userProfile should return 204 and empty body for NoContentException', async () => {
      // Act
      const getResponse = await request(app.getHttpServer())
        .get(`/userProfile/${mockProfile.nationalId}`)
        .expect(204)

      // Assert
      expect(getResponse.body).toStrictEqual({})
    })

    it('GET /userProfile should return profile', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfileNoEmailNoPhone)

      // Act
      const getResponse = await request(app.getHttpServer())
        .get(`/userProfile/${mockProfile.nationalId}`)
        .expect(200)

      // Assert
      expect(getResponse.body).toEqual(
        expect.objectContaining({ nationalId: mockProfile.nationalId }),
      )
      expect(getResponse.body).toEqual(
        expect.objectContaining({ locale: mockProfile.locale }),
      )
    })

    it('GET /userProfile should return 403 forbidden on invalid authentication', async () => {
      //Arrange
      const invalidNationalId = '0987654321'

      // Act
      await request(app.getHttpServer())
        .get(`/userProfile/${invalidNationalId}`)
        // Assert
        .expect(403)
    })
  })

  describe('PATCH /userProfile', () => {
    it('PATCH /userProfile should update profile', async () => {
      //Arrange
      const updatedProfile = {
        locale: 'is',
        documentNotifications: true,
      }
      await request(app.getHttpServer()).post('/userProfile').send(mockProfile)

      // Act
      const updateResponse = await request(app.getHttpServer())
        .patch(`/userProfile/${mockProfile.nationalId}`)
        .send(updatedProfile)
        .expect(200)

      // Assert
      expect(updateResponse.body).toEqual(
        expect.objectContaining({ nationalId: mockProfile.nationalId }),
      )
      expect(updateResponse.body).toEqual(
        expect.objectContaining({ locale: updatedProfile.locale }),
      )
      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          documentNotifications: updatedProfile.documentNotifications,
        }),
      )
    })

    it('PATCH /userProfile/ should return 403 forbidden on invalid authentication', async () => {
      // Arrange
      const updatedProfile = {
        mobilePhoneNumber: '987654321',
        locale: 'is',
        email: 'email@email.is',
      }
      const invalidNationalId = '0987654321'

      // Act
      await request(app.getHttpServer())
        .patch(`/userProfile/${invalidNationalId}`)
        .send(updatedProfile)
        // Assert
        .expect(403)
    })
  })

  describe('POST /emailVerification/:nationalId', () => {
    it('POST /emailVerification/:nationalId re-creates an email verification in db', async () => {
      const sutProfile = {
        ...mockProfileNoEmailNoPhone,
        email,
      }
      // Arrange

      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)

      const oldVerification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
        order: [['created', 'DESC']],
      })

      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve(''))
      await request(app.getHttpServer())
        .post('/userProfile')
        .send({ ...sutProfile, emailCode: oldVerification.hash })
        .expect(201)

      // Act
      await request(app.getHttpServer())
        .post(`/emailVerification/${mockProfile.nationalId}`)
        .expect(204)
      const newVerification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
        order: [['created', 'DESC']],
      })

      // Assert
      expect(spy).toHaveBeenCalled()
      expect(newVerification.hash).not.toEqual(oldVerification.hash)
    })

    it('POST /emailVerification/:nationalId returns 400 bad request on missing email', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/userProfile')
        .send({
          nationalId: mockProfile.nationalId,
          locale: mockProfile.locale,
        })
        .expect(201)

      // Act
      const response = await request(app.getHttpServer())
        .post(`/emailVerification/${mockProfile.nationalId}`)
        // Assert
        .expect(400)

      expect(response.body).toMatchObject({
        detail: 'Profile does not have a configured email address.',
        status: 400,
        title: 'Bad Request',
        type: 'https://httpstatuses.org/400',
      })
    })

    it('POST /emailVerification/:nationalId returns 403 forbidden for invalid authentication', async () => {
      // Arrange
      const invalidNationalId = '0987654321'
      await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfileNoEmailNoPhone)
        .expect(201)

      // Act
      await request(app.getHttpServer())
        .post(`/emailVerification/${invalidNationalId}`)
        // Assert
        .expect(403)
    })
  })

  describe('POST /emailVerification', () => {
    it('POST /emailVerification/ creates a email verfication in db', async () => {
      // Act
      const spy = jest.spyOn(emailService, 'sendEmail')
      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)
      expect(spy).toHaveBeenCalled()
      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
      })

      // Assert
      expect(verification).toBeDefined()
      expect(verification.hash).toMatch(/^\d{6}$/)
    })
  })

  describe('POST /confirmEmail', () => {
    it('POST /confirmEmail/ marks as confirmed', async () => {
      //Arrange
      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)

      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId, email: mockProfile.email },
      })

      /**
       * Omitting tel as input to bypass the mobilephonenumber confirmation within userprofile controller.
       * Otherwise this test will always fail as confirmEmail/ would be called, and it will delete
       * the verification before it can be checked by this test.
       */
      await request(app.getHttpServer())
        .post('/userProfile')
        .send({ ...mockProfileNoEmailNoPhone, emailCode: verification.hash })
        .expect(201)

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmEmail/${mockProfile.nationalId}`)
        .send({
          hash: verification.hash,
          email: mockProfile.email,
        })
        .expect(200)

      // Assert
      expect(response.body).toEqual(
        expect.objectContaining({ confirmed: true }),
      )
    })

    it('POST /confirmEmail/ returns 403 forbidden for invalid authentication', async () => {
      //Arrange
      const invalidNationalId = '0987654321'

      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)

      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
      })

      await request(app.getHttpServer())
        .post('/userProfile')
        .send({ ...mockProfileNoEmailNoPhone, emailCode: verification.hash })
        .expect(201)

      // Act
      await request(app.getHttpServer())
        .post(`/confirmEmail/${invalidNationalId}`)
        .send({
          hash: verification.hash,
          email: mockProfile.email,
        })
        // Assert
        .expect(403)
    })

    it('POST /confirmEmail/ returns confirmed: false for non-matching emails', async () => {
      //Arrange
      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)

      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId, email: mockProfile.email },
      })

      await request(app.getHttpServer())
        .post('/userProfile')
        .send({ ...mockProfileNoEmailNoPhone, emailCode: verification.hash })
        .expect(201)

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmEmail/${mockProfile.nationalId}`)
        .send({
          hash: verification.hash,
          email: 'wrong-email@example.com',
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "Email verification code does not match.",
        }
      `)
    })

    it('POST /confirmEmail/ returns confirmed: false for non-matching hash', async () => {
      //Arrange
      const INCORRECT_HASH = 'incorrect-hash'

      await request(app.getHttpServer())
        .post('/emailVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          email: mockProfile.email,
        })
        .expect(204)

      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId, email: mockProfile.email },
      })

      await request(app.getHttpServer())
        .post('/userProfile')
        .send({ ...mockProfileNoEmailNoPhone, emailCode: verification.hash })
        .expect(201)

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmEmail/${mockProfile.nationalId}`)
        .send({
          hash: INCORRECT_HASH,
          email: mockProfile.email,
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "Email verification code does not match.",
          "remainingAttempts": 4,
        }
      `)
    })
  })

  describe('POST /smsVerification', () => {
    it('POST /smsVerification/ creates a sms verification in db', async () => {
      // Act
      const spy = jest.spyOn(smsService, 'sendSms')
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)
      expect(spy).toHaveBeenCalled()
      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })

      // Assert
      expect(verification).toBeDefined()
      expect(verification.smsCode).toMatch(/^\d{6}$/)
    })
  })

  describe('POST /confirmSms', () => {
    it('POST /confirmSms/ marks as verified', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)
      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({
          code: verification.smsCode,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": true,
          "message": "SMS confirmed",
        }
      `)
    })

    it('POST /confirmSms/ returns 403 forbidden for invalid authentication', async () => {
      // Arrange
      const invalidNationalId = '0987654321'
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)
      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })

      // Act
      await request(app.getHttpServer())
        .post(`/confirmSms/${invalidNationalId}`)
        .send({
          code: verification.smsCode,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        // Assert
        .expect(403)
    })

    it('POST /confirmSms/ returns confirmed: false for missing verifications', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({
          code: '123456',
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        // Assert
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "SMS verification does not exist for this user",
        }
      `)
    })

    it('POST /confirmSms/ returns confirmed: false for expired verifications', async () => {
      // Arrange
      jest.setSystemTime(new Date(2020, 5, 1))
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)
      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })
      jest.setSystemTime(new Date(2020, 5, 2))

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({
          code: verification.smsCode,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "SMS verification is expired",
        }
      `)
    })

    it('POST /confirmSms/ returns confirmed: false after too many tries', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)
      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })

      // Act
      for (let i = 0; i < SMS_VERIFICATION_MAX_TRIES; i++) {
        const response = await request(app.getHttpServer())
          .post(`/confirmSms/${mockProfile.nationalId}`)
          .send({ code: '1', mobilePhoneNumber: mockProfile.mobilePhoneNumber })
          .expect(200)
        expect(response.body).toMatchObject({
          confirmed: false,
          message: expect.stringMatching(/SMS code is not a match/),
        })
        expect(response.body.message).toContain(
          `${SMS_VERIFICATION_MAX_TRIES - (i + 1)}`,
        )
      }
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({
          code: verification.smsCode,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "Too many failed SMS verifications. Please restart verification.",
          "remainingAttempts": -1,
        }
      `)
    })

    it('POST /confirmSms/ works after restarting a failed sms verification', async () => {
      // Arrange
      jest.setSystemTime(new Date(2020, 5, 1))
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)

      // Tried too many times.
      for (let i = 0; i < SMS_VERIFICATION_MAX_TRIES; i++) {
        await request(app.getHttpServer())
          .post(`/confirmSms/${mockProfile.nationalId}`)
          .send({ code: '1', mobilePhoneNumber: mockProfile.mobilePhoneNumber })
      }

      // Expire verification.
      jest.setSystemTime(new Date(2020, 5, 2))

      // Act - Try again
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)
      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({
          code: verification.smsCode,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": true,
          "message": "SMS confirmed",
        }
      `)
    })

    it('POST /confirmSms/ returns confirmed: false for non-matching mobile numbers', async () => {
      //Arrange
      await request(app.getHttpServer())
        .post('/smsVerification/')
        .send({
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(204)

      const verification = await SmsVerification.findOne({
        where: {
          nationalId: mockProfile.nationalId,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        },
      })

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({
          code: verification.smsCode,
          mobilePhoneNumber: '7777777',
        })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
          Object {
            "confirmed": false,
            "message": "SMS verification does not exist for this user",
          }
        `)
    })
  })

  describe('/userProfile/{nationalId}/device-tokens', () => {
    it('GET /userProfile/{nationalId}/device-tokens should 401 as admin:scope is needed and is IdsAuthGuard-ed', async () => {
      await request(app.getHttpServer())
        .get(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send()
        .expect(401)
    })

    it('GET /userProfile/{nationalId}/notification-settings should 401 as admin:scope is needed and is IdsAuthGuard-ed', async () => {
      await request(app.getHttpServer())
        .get(`/userProfile/${mockProfile.nationalId}/notification-settings`)
        .send()
        .expect(401)
    })

    it('POST /userProfile/{nationalId}/device-tokens should return 201 created', async () => {
      // create it
      const response = await request(app.getHttpServer())
        .post(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send({
          deviceToken: mockDeviceToken.deviceToken,
        })
        .expect(201)

      expect(response.body).toEqual(
        expect.objectContaining({
          deviceToken: mockDeviceToken.deviceToken,
          nationalId: mockProfile.nationalId,
        }),
      )
    })

    it('POST /userProfile/{nationalId}/device-tokens duplicate token should return the existing token', async () => {
      // create it
      const res1 = await request(app.getHttpServer())
        .post(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send({
          deviceToken: mockDeviceToken.deviceToken,
        })
        .expect(201)
      // try to create same again
      const res2 = await request(app.getHttpServer())
        .post(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send({
          deviceToken: mockDeviceToken.deviceToken,
        })
        .expect(201)

      expect(res1.body).toEqual(res2.body)
    })

    it('POST /userProfile/{nationalId}/device-tokens with missing payload should 400 bad request', async () => {
      // create it
      await request(app.getHttpServer())
        .post(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send({})
        .expect(400)
    })

    it('DELETE /userProfile/{nationalId}/device-tokens should remove row with 200', async () => {
      // create one first ...
      await request(app.getHttpServer())
        .post(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send({
          deviceToken: mockDeviceToken.deviceToken,
        })
        .expect(201)

      // ... so we can delete it
      const response = await request(app.getHttpServer())
        .delete(`/userProfile/${mockProfile.nationalId}/device-tokens`)
        .send({
          deviceToken: mockDeviceToken.deviceToken,
        })
        .expect(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
        }),
      )
    })
  })
})
