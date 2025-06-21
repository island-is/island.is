import { UserProfileScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { setupApp, TestApp } from '@island.is/testing/nest'
import { getModelToken } from '@nestjs/sequelize'
import faker from 'faker'
import kennitala from 'kennitala'
import request, { SuperTest, Test } from 'supertest'
import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { EmailVerification } from '../../user-profile/emailVerification.model'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'
import { UserProfile } from '../../user-profile/userProfile.model'
import { formatPhoneNumber } from '../../utils/format-phone-number'
import { CreateEmailDto } from '../dto/create-emails.dto'
import { ActorProfile } from '../models/actor-profile.model'
import { Emails } from '../models/emails.model'
import { EmailsDto } from '../dto/emails.dto'

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

// Create actor test data
const actorNationalId = createNationalId()
const actorEmail = faker.internet.email()

describe('Emails controller', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let actorApp: TestApp
  let actorServer: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let emailsModel: typeof Emails
  let userProfileModel: typeof UserProfile
  let emailVerificationModel: typeof EmailVerification
  let actorProfileModel: typeof ActorProfile

  // Test setup and teardown
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      dbType: 'postgres',
      user: createCurrentUser({
        nationalId: testUserProfile.nationalId,
        scope: [UserProfileScope.read],
      }),
    })

    // Create actor app with user that has actor context
    actorApp = await setupApp({
      AppModule,
      SequelizeConfigService,
      dbType: 'postgres',
      user: {
        ...createCurrentUser({
          nationalId: actorNationalId,
          scope: [UserProfileScope.read],
        }),
        actor: {
          nationalId: testUserProfile.nationalId,
          scope: [UserProfileScope.read],
        },
      },
    })

    server = request(app.getHttpServer())
    actorServer = request(actorApp.getHttpServer())
    fixtureFactory = new FixtureFactory(app)

    // Get model references
    emailsModel = app.get<typeof Emails>(getModelToken(Emails))
    userProfileModel = app.get<typeof UserProfile>(getModelToken(UserProfile))
    emailVerificationModel = app.get<typeof EmailVerification>(
      getModelToken(EmailVerification),
    )
    actorProfileModel = app.get<typeof ActorProfile>(
      getModelToken(ActorProfile),
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
      actorProfileModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      }),
    ])
  })

  afterAll(async () => {
    await app.cleanUp()
    await actorApp.cleanUp()
  })

  describe('GET /v2/actor/emails', () => {
    beforeEach(() => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
    })

    it('should return empty list when user has no emails', async () => {
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      const res = await server.get(
        `/v2/actor/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([])
    })

    it('should return single email when user has one email', async () => {
      await fixtureFactory.createUserProfile(testUserProfile)

      const res = await server.get(
        `/v2/actor/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject([
        {
          email: testUserProfileEmail.email,
          primary: testUserProfileEmail.primary,
          isConnectedToActorProfile: false,
        },
      ])
    })

    it('should return email with isConnectedToActorProfile=true when connected to an actor profile', async () => {
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      // Create an email
      const email = await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'connected@example.com',
        primary: false,
      })

      // Create an actor profile referencing the email
      await fixtureFactory.createActorProfile({
        toNationalId: createNationalId(), // Another user's national ID
        fromNationalId: testUserProfile.nationalId,
        emailNotifications: true,
        emailsId: email.id,
      })

      const res = await server.get(
        `/v2/actor/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        email: 'connected@example.com',
        primary: false,
        isConnectedToActorProfile: true,
      })
    })

    it('should return 400 for invalid national id', async () => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(false)
      const invalidNationalId = 'invalid-national-id'

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        nationalId: invalidNationalId,
      })

      const res = await server.get('/v2/actor/emails')

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        type: 'https://httpstatuses.org/400',
        title: 'Bad Request',
        detail: 'Invalid nationalId',
      })
    })

    it('should return multiple emails with correct isConnectedToActorProfile values', async () => {
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      // Create two emails
      await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'test1@example.com',
        primary: true,
      })

      const email2 = await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'test2@example.com',
        primary: false,
      })

      // Connect only the second email to an actor profile
      await fixtureFactory.createActorProfile({
        toNationalId: createNationalId(),
        fromNationalId: testUserProfile.nationalId,
        emailNotifications: true,
        emailsId: email2.id,
      })

      const res = await server.get(
        `/v2/actor/emails?nationalId=${testUserProfile.nationalId}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(2)

      const firstEmail = res.body.find(
        (e: EmailsDto) => e.email === 'test1@example.com',
      )
      const secondEmail = res.body.find(
        (e: EmailsDto) => e.email === 'test2@example.com',
      )

      expect(firstEmail).toMatchObject({
        email: 'test1@example.com',
        primary: true,
        isConnectedToActorProfile: false,
      })

      expect(secondEmail).toMatchObject({
        email: 'test2@example.com',
        primary: false,
        isConnectedToActorProfile: true,
      })
    })

    it('should fetch emails for actor.nationalId when actor context is present', async () => {
      // Create user profile with emails for the actor's target
      await fixtureFactory.createUserProfile(testUserProfile)

      // Create a user profile for the actor as well
      await fixtureFactory.createUserProfile({
        nationalId: actorNationalId,
        emails: [{ email: actorEmail, primary: true }],
        mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
      })

      // Actor should get emails for user.actor.nationalId
      const res = await actorServer.get('/v2/actor/emails')

      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        email: testUserProfileEmail.email,
        primary: testUserProfileEmail.primary,
      })

      // Verify actor's own emails are not returned
      const actorEmails = res.body.find(
        (e: EmailsDto) => e.email === actorEmail,
      )
      expect(actorEmails).toBeUndefined()
    })
  })

  describe('POST /v2/actor/emails', () => {
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

      const res = await server.post('/v2/actor/emails').send({
        email: 'test@example.com',
        code: '123',
      } as CreateEmailDto)

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: 'test@example.com',
        emailStatus: 'VERIFIED',
      })

      const emailInDb = await emailsModel.findOne({
        where: {
          nationalId: testUserProfile.nationalId,
          email: 'test@example.com',
        },
        useMaster: true,
      })

      expect(emailInDb).toBeTruthy()
      expect(emailInDb?.email).toBe('test@example.com')
      expect(emailInDb?.emailStatus).toBe('VERIFIED')
    })

    it('should verify email if it already exists', async () => {
      await setupEmailVerification()

      await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'test@example.com',
        primary: false,
        emailStatus: DataStatus.NOT_VERIFIED,
      })

      const res = await server.post('/v2/actor/emails').send({
        email: 'test@example.com',
        code: '123',
      } as CreateEmailDto)

      expect(res.status).toEqual(200)

      const emailInDb = await emailsModel.findOne({
        where: {
          nationalId: testUserProfile.nationalId,
          email: 'test@example.com',
        },
        useMaster: true,
      })

      expect(emailInDb).toBeTruthy()
      expect(emailInDb?.email).toBe('test@example.com')
      expect(emailInDb?.emailStatus).toBe('VERIFIED')
    })

    it('should return 400 for mismatched verification code', async () => {
      await setupEmailVerification()

      const res = await server.post('/v2/actor/emails').send({
        email: 'test@example.com',
        code: 'wrong-code',
      } as CreateEmailDto)

      expect(res.status).toEqual(400)
    })

    it('should return 400 for unverified email', async () => {
      await setupEmailVerification()

      const res = await server.post('/v2/actor/emails').send({
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

      const res = await server.post('/v2/actor/emails').send({
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

    it('should create email for actor.nationalId when actor context is present', async () => {
      // Set up profiles and verification for both the actor and the target user
      await fixtureFactory.createUserProfile({
        nationalId: actorNationalId,
        emails: [{ email: actorEmail, primary: true }],
        mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
      })

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [],
      })

      // Create email verification for the target user
      await fixtureFactory.createEmailVerification({
        nationalId: testUserProfile.nationalId,
        email: 'actor-verified@example.com',
        hash: 'actor123',
      })

      // Actor creates email for target user
      const res = await actorServer.post('/v2/actor/emails').send({
        email: 'actor-verified@example.com',
        code: 'actor123',
      } as CreateEmailDto)

      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({
        email: 'actor-verified@example.com',
        emailStatus: 'VERIFIED',
      })

      // Verify email was created for the target user (not the actor)
      const emails = await emailsModel.findAll({
        where: { nationalId: testUserProfile.nationalId },
      })
      expect(emails).toHaveLength(1)
      expect(emails[0].email).toBe('actor-verified@example.com')

      // Verify no email was created for the actor
      const actorEmails = await emailsModel.findAll({
        where: {
          nationalId: actorNationalId,
          email: 'actor-verified@example.com',
        },
      })
      expect(actorEmails).toHaveLength(0)
    })
  })

  describe('DELETE /v2/actor/emails/:emailId', () => {
    beforeEach(() => {
      jest.spyOn(kennitala, 'isValid').mockReturnValue(true)
    })

    it('should successfully delete an email', async () => {
      // Create user profile with the test email
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      // Create a non-primary email to delete
      const emailToDelete = await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'delete-me@example.com',
        primary: false,
      })

      // Verify email exists before deletion
      const emailBeforeDeletion = await emailsModel.findOne({
        where: {
          id: emailToDelete.id,
        },
      })
      expect(emailBeforeDeletion).not.toBeNull()

      const res = await server.delete(`/v2/actor/emails/${emailToDelete.id}`)

      expect(res.status).toEqual(200)
      expect(res.body).toBeTruthy()

      // Verify email was deleted from database
      const emailInDb = await emailsModel.findOne({
        where: {
          id: emailToDelete.id,
        },
      })
      expect(emailInDb).toBeNull()

      // Also verify by count that the email is no longer in the database
      const emailCount = await emailsModel.count({
        where: {
          nationalId: testUserProfile.nationalId,
        },
      })
      expect(emailCount).toBe(0)
    })

    it('should be able to delete primary email', async () => {
      // Create user profile with the test email
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      // Create a primary email
      const primaryEmail = await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'primary@example.com',
        primary: true,
      })

      const res = await server.delete(`/v2/actor/emails/${primaryEmail.id}`)

      expect(res.status).toEqual(200)
      expect(res.body).toBeTruthy()

      // Verify email was not deleted from database
      const emailInDb = await emailsModel.findOne({
        where: {
          id: primaryEmail.id,
        },
      })
      expect(emailInDb).toBeNull()

      // Also verify by count that the email is still in the database
      const emailCount = await emailsModel.count({
        where: {
          nationalId: testUserProfile.nationalId,
        },
      })
      expect(emailCount).toBe(0)
    })

    it('should return 400 when email does not exist', async () => {
      // Create user profile
      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [],
      })

      const nonExistentEmailId = '12345678-1234-1234-1234-123456789012'
      const res = await server.delete(`/v2/actor/emails/${nonExistentEmailId}`)

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
        detail: 'Email not found or does not belong to this user',
      })

      // Verify database state remains unchanged
      const emailCount = await emailsModel.count({
        where: {
          nationalId: testUserProfile.nationalId,
        },
      })
      expect(emailCount).toBe(0)
    })

    it("should not allow deletion of another user's email", async () => {
      // Create two users
      await fixtureFactory.createUserProfile({ ...testUserProfile, emails: [] })

      const otherUserNationalId = createNationalId()
      await fixtureFactory.createUserProfile({
        nationalId: otherUserNationalId,
        emails: [],
        mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
      })

      // Create an email for the other user
      const otherUserEmail = await fixtureFactory.createEmail({
        nationalId: otherUserNationalId,
        email: 'other-user@example.com',
        primary: false,
      })

      // Attempt to delete the other user's email
      const res = await server.delete(`/v2/actor/emails/${otherUserEmail.id}`)

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
        detail: 'Email not found or does not belong to this user',
      })

      // Verify email was not deleted from database
      const emailInDb = await emailsModel.findOne({
        where: {
          id: otherUserEmail.id,
        },
      })
      expect(emailInDb).not.toBeNull()

      // Verify both users' email counts remain unchanged
      const testUserEmailCount = await emailsModel.count({
        where: {
          nationalId: testUserProfile.nationalId,
        },
      })
      expect(testUserEmailCount).toBe(0)

      const otherUserEmailCount = await emailsModel.count({
        where: {
          nationalId: otherUserNationalId,
        },
      })
      expect(otherUserEmailCount).toBe(1)
    })

    it('should delete email for actor.nationalId when actor context is present', async () => {
      // Create profiles for both the actor and the target user
      await fixtureFactory.createUserProfile({
        nationalId: actorNationalId,
        emails: [{ email: actorEmail, primary: true }],
        mobilePhoneNumber: formatPhoneNumber(createPhoneNumber()),
      })

      await fixtureFactory.createUserProfile({
        ...testUserProfile,
        emails: [],
      })

      // Create a non-primary email for the target user to be deleted
      const targetUserEmail = await fixtureFactory.createEmail({
        nationalId: testUserProfile.nationalId,
        email: 'actor-target-delete@example.com',
        primary: false,
      })

      // Create an email for the actor user (should not be affected)
      const actorOwnEmail = await fixtureFactory.createEmail({
        nationalId: actorNationalId,
        email: 'actor-own-email@example.com',
        primary: false,
      })

      // Actor deletes email for target user
      const res = await actorServer.delete(
        `/v2/actor/emails/${targetUserEmail.id}`,
      )

      expect(res.status).toEqual(200)
      expect(res.body).toBeTruthy()

      // Verify target user's email was deleted
      const targetEmailAfter = await emailsModel.findOne({
        where: { id: targetUserEmail.id },
      })
      expect(targetEmailAfter).toBeNull()

      // Verify actor's own email was not affected
      const actorEmailAfter = await emailsModel.findOne({
        where: { id: actorOwnEmail.id },
      })
      expect(actorEmailAfter).not.toBeNull()
    })
  })
})
