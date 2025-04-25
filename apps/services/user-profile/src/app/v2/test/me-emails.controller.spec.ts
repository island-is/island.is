import faker from 'faker'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { formatPhoneNumber } from '../../utils/format-phone-number'
import { setupApp, TestApp } from '@island.is/testing/nest'
import request, { SuperTest, Test } from 'supertest'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { Emails } from '../models/emails.model'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfileScope } from '@island.is/auth/scopes'
import { getModelToken } from '@nestjs/sequelize'
import kennitala from 'kennitala'
import { UserProfile } from '../../user-profile/userProfile.model'
import { CreateEmailDto } from '../dto/create-emails.dto'
import { EmailVerification } from '../../user-profile/emailVerification.model'

// Test data setup
const testUserProfileEmail = {
  email: faker.internet.email(),
  primary: true,
}

const testUserProfile = {
  nationalId: createNationalId(),
  emails: [testUserProfileEmail],
  mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
}

describe('Me emails controller', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let emailsModel: typeof Emails
  let userProfileModel: typeof UserProfile
  let emailVerificationModel: typeof EmailVerification

  // Test setup and teardown
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read, UserProfileScope.write],
      }),
    })

    server = request(app.getHttpServer())
    fixtureFactory = new FixtureFactory(app)

    // Get model references
    emailsModel = app.get<typeof Emails>(getModelToken(Emails))
    userProfileModel = app.get<typeof UserProfile>(getModelToken(UserProfile))
    emailVerificationModel = app.get<typeof EmailVerification>(
      getModelToken(EmailVerification),
    )
  })

  afterEach(async () => {
    // Clean up database after each test
    await Promise.all([
      emailsModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      }),
      userProfileModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      }),
      emailVerificationModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      }),
    ])
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('GET /v2/me/emails', () => {
    beforeEach(() => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
    })

    it('should return empty list when user has no emails', async () => {
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      const res = await server.get(
        `/v2/me/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([])
    })

    it('should return single email when user has one email', async () => {
      await fixtureFactory.createUserProfile(testUserProfile)

      const res = await server.get(
        `/v2/me/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([
        {
          email: testUserProfileEmail.email,
          primary: testUserProfileEmail.primary,
        },
      ])
    })

    it('should return 400 for invalid national id', async () => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(false)
      const invalidNationalId = 'invalid-national-id'

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        nationalId: invalidNationalId,
      })

      const res = await server.get('/v2/me/emails')

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        type: 'https://httpstatuses.org/400',
        title: 'Bad Request',
        detail: 'Invalid nationalId',
      })
    })

    it('should return multiple emails when they exist', async () => {
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      await Promise.all([
        fixtureFactory.createEmail({
          nationalId: testUserProfile.nationalId,
          email: 'test1@example.com',
          primary: true,
        }),
        fixtureFactory.createEmail({
          nationalId: testUserProfile.nationalId,
          email: 'test2@example.com',
          primary: false,
        }),
      ])

      const res = await server.get(
        `/v2/me/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([
        { email: 'test1@example.com', primary: true },
        { email: 'test2@example.com', primary: false },
      ])
    })
  })

  describe('POST /v2/me/emails', () => {
    beforeEach(() => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
    })

    const setupEmailVerification = async () => {
      await fixtureFactory.createUserProfile(testUserProfile)
      await fixtureFactory.createEmailVerification({
        nationalId: testUserProfile.nationalId,
        email: 'test@example.com',
        hash: '123',
      })
    }

    it('should successfully create new email', async () => {
      await setupEmailVerification()

      const res = await server.post('/v2/me/emails').send({
        email: 'test@example.com',
        code: '123',
      } as CreateEmailDto)

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: 'test@example.com',
      })

      const emailInDb = await emailsModel.findOne({
        where: {
          nationalId: testUserProfile.nationalId,
          email: 'test@example.com',
        },
      })
      expect(emailInDb).toBeTruthy()
      expect(emailInDb?.email).toBe('test@example.com')
      expect(emailInDb?.emailStatus).toBe('VERIFIED')
    })

    it('should return 400 for mismatched verification code', async () => {
      await setupEmailVerification()

      const res = await server.post('/v2/me/emails').send({
        email: 'test@example.com',
        code: 'wrong-code',
      } as CreateEmailDto)

      expect(res.status).toEqual(400)
    })

    it('should return 400 for unverified email', async () => {
      await setupEmailVerification()

      const res = await server.post('/v2/me/emails').send({
        email: 'wrong-email@example.com',
        code: '123',
      } as CreateEmailDto)

      expect(res.status).toEqual(400)
    })

    it('should create verified email with correct status', async () => {
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [],
      })
      await fixtureFactory.createEmailVerification({
        nationalId: testUserProfile.nationalId,
        email: 'test@example.com',
        hash: '123',
      })

      const res = await server.post('/v2/me/emails').send({
        email: 'test@example.com',
        code: '123',
      } as CreateEmailDto)

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: 'test@example.com',
        emailStatus: 'VERIFIED',
      })

      const emails = await emailsModel.findAll({
        where: { nationalId: testUserProfile.nationalId },
      })

      expect(emails).toHaveLength(1)
      expect(emails[0]).toMatchObject({
        email: 'test@example.com',
        emailStatus: 'VERIFIED',
        primary: false,
      })
    })
  })
})
