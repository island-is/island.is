import { setup } from '../../../../test/setup'
import request, { Response } from 'supertest'
import { INestApplication } from '@nestjs/common'
import { EmailService } from '@island.is/email-service'
import { EmailVerification } from '../emailVerification.model'
import { SmsVerification } from '../smsVerification.model'
import { SmsService } from '@island.is/nova-sms'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { UserProfileScope } from '@island.is/auth/scopes'
import { SMS_VERIFICATION_MAX_TRIES } from '../verification.service'

jest.useFakeTimers('modern')

let app: INestApplication
let emailService: EmailService
let smsService: SmsService

const mockProfile = {
  nationalId: '1234567890',
  locale: 'en',
  email: 'email@example.com',
  mobilePhoneNumber: '9876543',
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
    it('POST /userProfile should register userProfile with no phonenumber', async () => {
      // Arrange
      const { mobilePhoneNumber, ...sutProfile } = mockProfile

      // Act
      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve('user'))
      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send(sutProfile)
        .expect(201)
      expect(spy).toHaveBeenCalled()
      expect(response.body.id).toBeTruthy()
    })

    it('POST /userProfile should register userProfile with no email', async () => {
      // Arrange
      const { email, ...sutProfile } = mockProfile

      // Act
      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve('user'))
      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send(sutProfile)
        .expect(201)
      expect(spy).toHaveBeenCalled()
      expect(response.body.id).toBeTruthy()
    })

    it('POST /userProfile should register userProfile and create verification', async () => {
      // Act
      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve('user'))
      const response = await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfile)
        .expect(201)
      expect(spy).toHaveBeenCalled()
      expect(response.body.id).toBeTruthy()

      const verification = await EmailVerification.findOne({
        where: { nationalId: response.body.nationalId },
      })

      // Assert
      expect(verification.email).toEqual(mockProfile.email)
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
        .send(mockProfile)
        .expect(201)

      const conflictResponse = await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfile)
        .expect(409)

      // Assert
      expect(conflictResponse.body.error).toBe('Conflict')
      expect(conflictResponse.body.message).toBe(
        `A profile with nationalId - "${mockProfile.nationalId}" already exists`,
      )
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
      expect(response.body.error).toBe('Bad Request')

      expect(response.body.message).toEqual(
        expect.arrayContaining(['locale must be a valid enum value']),
      )
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
    it('GET /userProfile should return 404 not found error msg', async () => {
      // Act
      const getResponse = await request(app.getHttpServer())
        .get(`/userProfile/${mockProfile.nationalId}`)
        .expect(404)

      // Assert
      expect(getResponse.body.error).toBe('Not Found')
      expect(getResponse.body.message).toBe(
        `A user profile with nationalId ${mockProfile.nationalId} does not exist`,
      )
    })

    it('GET /userProfile should return profile', async () => {
      // Arrange
      await request(app.getHttpServer()).post('/userProfile').send(mockProfile)

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
      expect(getResponse.body).toEqual(
        expect.objectContaining({ email: mockProfile.email }),
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

  describe('PUT /userProfile', () => {
    it('PUT /userProfile/ should return 404 not found error msg', async () => {
      // Arrange
      const updatedProfile = {
        mobilePhoneNumber: '9876543',
        locale: 'is',
        email: 'email@email.is',
      }

      // Act
      const updateResponse = await request(app.getHttpServer())
        .put(`/userProfile/${mockProfile.nationalId}`)
        .send(updatedProfile)
        .expect(404)

      // Assert
      expect(updateResponse.body.error).toBe('Not Found')
      expect(updateResponse.body.message).toBe(
        `A user profile with nationalId ${mockProfile.nationalId} does not exist`,
      )
    })

    it('PUT /userProfile should update profile', async () => {
      //Arrange
      const updatedProfile = {
        locale: 'is',
      }
      await request(app.getHttpServer()).post('/userProfile').send(mockProfile)

      // Act
      const updateResponse = await request(app.getHttpServer())
        .put(`/userProfile/${mockProfile.nationalId}`)
        .send(updatedProfile)
        .expect(200)

      // Assert
      expect(updateResponse.body).toEqual(
        expect.objectContaining({ nationalId: mockProfile.nationalId }),
      )
      expect(updateResponse.body).toEqual(
        expect.objectContaining({ locale: updatedProfile.locale }),
      )
    })

    it('PUT /userProfile with email should create verification', async () => {
      // Arrange
      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve('user'))
      await request(app.getHttpServer())
        .post('/userProfile')
        .send({
          nationalId: mockProfile.nationalId,
          locale: mockProfile.locale,
          mobilePhoneNumber: mockProfile.mobilePhoneNumber,
        })
        .expect(201)

      //Act
      const response = await request(app.getHttpServer())
        .put(`/userProfile/${mockProfile.nationalId}`)
        .send({
          email: mockProfile.email,
        })
        .expect(200)
      expect(spy).toHaveBeenCalled()
      expect(response.body.id).toBeTruthy()

      const verification = await EmailVerification.findOne({
        where: { nationalId: response.body.nationalId },
      })

      expect(verification.email).toEqual(mockProfile.email)
      expect(verification.nationalId).toEqual(mockProfile.nationalId)
    })

    it('PUT /userProfile/ should return 403 forbidden on invalid authentication', async () => {
      // Arrange
      const updatedProfile = {
        mobilePhoneNumber: '987654321',
        locale: 'is',
        email: 'email@email.is',
      }
      const invalidNationalId = '0987654321'

      // Act
      await request(app.getHttpServer())
        .put(`/userProfile/${invalidNationalId}`)
        .send(updatedProfile)
        // Assert
        .expect(403)
    })
  })

  describe('POST /emailVerification', () => {
    it('POST /emailVerification/:nationalId re-creates an email verfication in db', async () => {
      // Arrange
      const spy = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation(() => Promise.resolve(''))
      await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfile)
        .expect(201)

      const oldVerification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
        order: [['created', 'DESC']],
      })

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

      expect(response.body.message).toBe(
        'Profile does not have a configured email address.',
      )
    })

    it('POST /emailVerification/:nationalId returns 403 forbidden for invalid authentication', async () => {
      // Arrange
      const invalidNationalId = '0987654321'
      await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfile)
        .expect(201)

      // Act
      await request(app.getHttpServer())
        .post(`/emailVerification/${invalidNationalId}`)
        // Assert
        .expect(403)
    })
  })

  describe('POST /confirmEmail', () => {
    it('POST /confirmEmail/ marks as confirmed', async () => {
      //Arrange
      await request(app.getHttpServer())
        .post('/userProfile')
        .send(mockProfile)
        .expect(201)
      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
      })

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmEmail/${mockProfile.nationalId}`)
        .send({
          hash: verification.hash,
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
        .post('/userProfile')
        .send(mockProfile)
        .expect(201)
      const verification = await EmailVerification.findOne({
        where: { nationalId: mockProfile.nationalId },
      })

      // Act
      await request(app.getHttpServer())
        .post(`/confirmEmail/${invalidNationalId}`)
        .send({
          hash: verification.hash,
        })
        // Assert
        .expect(403)
    })
  })

  describe('POST /smsVerification', () => {
    it('POST /smsVerification/ creates a sms verfication in db', async () => {
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
        where: { nationalId: mockProfile.nationalId },
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
        where: { nationalId: mockProfile.nationalId },
      })

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({ code: verification.smsCode })
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
        where: { nationalId: mockProfile.nationalId },
      })

      // Act
      await request(app.getHttpServer())
        .post(`/confirmSms/${invalidNationalId}`)
        .send({
          code: verification.smsCode,
        })
        // Assert
        .expect(403)
    })

    it('POST /confirmSms/ returns confirmed: false for missing verifications', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({ code: '123456' })
        // Assert
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "Sms verification does not exist for this user",
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
        where: { nationalId: mockProfile.nationalId },
      })
      jest.setSystemTime(new Date(2020, 5, 2))

      // Act
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({ code: verification.smsCode })
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
        where: { nationalId: mockProfile.nationalId },
      })

      // Act
      for (let i = 0; i < SMS_VERIFICATION_MAX_TRIES; i++) {
        const response = await request(app.getHttpServer())
          .post(`/confirmSms/${mockProfile.nationalId}`)
          .send({ code: '1' })
          .expect(200)
        expect(response.body).toMatchObject({
          confirmed: false,
          message: expect.stringMatching(/SMS code is not a match/),
        })
        expect(response.body.message).toContain(
          SMS_VERIFICATION_MAX_TRIES - (i + 1),
        )
      }
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({ code: verification.smsCode })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": false,
          "message": "Too many failed SMS verifications. Please restart verification.",
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
          .send({ code: '1' })
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
        where: { nationalId: mockProfile.nationalId },
      })
      const response = await request(app.getHttpServer())
        .post(`/confirmSms/${mockProfile.nationalId}`)
        .send({ code: verification.smsCode })
        .expect(200)

      // Assert
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "confirmed": true,
          "message": "SMS confirmed",
        }
      `)
    })
  })
})
