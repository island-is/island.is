import { getModelToken } from '@nestjs/sequelize'
import request, { SuperTest, Test } from 'supertest'
import faker from 'faker'
import { uuid } from 'uuidv4'

import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import { setupApp, setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'

import { FixtureFactory } from '../../../../test/fixture-factory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { UserProfile } from '../models/userProfile.model'
import { Emails } from '../models/emails.model'
import { DataStatus } from '../types/dataStatusTypes'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { AuditService } from '@island.is/nest/audit'

describe('Admin Emails Controller - GET /v2/users/.national-id/emails', () => {
  const adminNationalId = createNationalId('person')
  const testUserNationalId = createNationalId('person')
  const testUserEmail = faker.internet.email()
  const testUserPhone = formatPhoneNumber(createPhoneNumber())

  describe('Without authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })

      const server = request(app.getHttpServer())

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({
        status: 401,
        title: 'Unauthorized',
        type: 'https://httpstatuses.org/401',
      })

      await app.cleanUp()
    })

    it('should return 403 when user does not have AdminPortalScope.serviceDesk scope', async () => {
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: adminNationalId,
          scope: [],
        }),
      })

      const server = request(app.getHttpServer())

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        detail: 'Forbidden resource',
        status: 403,
        title: 'Forbidden',
        type: 'https://httpstatuses.org/403',
      })

      await app.cleanUp()
    })
  })

  describe('With authentication', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let emailsModel: typeof Emails
    let auditService: AuditService

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: adminNationalId,
          scope: [AdminPortalScope.serviceDesk],
        }),
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      userProfileModel = app.get(getModelToken(UserProfile))
      emailsModel = app.get(getModelToken(Emails))
      auditService = app.get(AuditService)
    })

    beforeEach(async () => {
      jest.restoreAllMocks()
      await emailsModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      })
      await userProfileModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should return 200 with empty array when user has no emails', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual([])
    })

    it('should return 200 with single email when user has one email', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [
          {
            email: testUserEmail,
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
        mobilePhoneNumber: testUserPhone,
      })

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        id: expect.any(String),
        email: testUserEmail,
        primary: true,
        emailStatus: DataStatus.VERIFIED,
        isConnectedToActorProfile: false,
      })
    })

    it('should return 200 with multiple emails', async () => {
      const primaryEmail = faker.internet.email()
      const secondaryEmail = faker.internet.email()

      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [
          {
            email: primaryEmail,
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
          {
            email: secondaryEmail,
            primary: false,
            emailStatus: DataStatus.NOT_VERIFIED,
          },
        ],
        mobilePhoneNumber: testUserPhone,
      })

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(2)

      const primary = res.body.find(
        (e: { primary: boolean }) => e.primary === true,
      )
      const secondary = res.body.find(
        (e: { primary: boolean }) => e.primary === false,
      )

      expect(primary).toMatchObject({
        email: primaryEmail,
        primary: true,
        emailStatus: DataStatus.VERIFIED,
      })

      expect(secondary).toMatchObject({
        email: secondaryEmail,
        primary: false,
        emailStatus: DataStatus.NOT_VERIFIED,
      })
    })

    it('should return 200 with empty array for non-existent user', async () => {
      const nonExistentNationalId = createNationalId('person')

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', nonExistentNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toEqual([])
    })

    it('should mark emails as connected to actor profile when applicable', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const email = await fixtureFactory.createEmail({
        nationalId: testUserNationalId,
        email: 'actor-connected@example.com',
        primary: true,
      })

      await fixtureFactory.createActorProfile({
        toNationalId: createNationalId('person'),
        fromNationalId: testUserNationalId,
        emailNotifications: true,
        emailsId: email.id,
      })

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        email: 'actor-connected@example.com',
        isConnectedToActorProfile: true,
      })
    })

    it('should invoke audit logging', async () => {
      const auditSpy = jest.spyOn(auditService, 'auditPromise')

      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [
          {
            email: testUserEmail,
            primary: true,
            emailStatus: DataStatus.VERIFIED,
          },
        ],
        mobilePhoneNumber: testUserPhone,
      })

      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(auditSpy).toHaveBeenCalled()

      const auditCall = auditSpy.mock.calls[0][0]
      expect(auditCall).toMatchObject({
        auth: expect.objectContaining({
          nationalId: adminNationalId,
        }),
        namespace: '@island.is/user-profile/v2/users',
        action: 'getUserEmails',
      })
    })

    it('should return 400 for invalid national ID', async () => {
      const res = await server
        .get('/v2/users/.national-id/emails')
        .set('X-Param-National-Id', 'invalid-national-id')

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
        detail: 'National id is not valid',
      })
    })
  })
})

describe('Admin Emails Controller - DELETE /v2/users/.national-id/emails/:emailId', () => {
  const adminNationalId = createNationalId('person')
  const testUserNationalId = createNationalId('person')
  const testUserPhone = formatPhoneNumber(createPhoneNumber())

  describe('Without authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })

      const server = request(app.getHttpServer())
      const emailId = uuid()

      const res = await server
        .delete(`/v2/users/.national-id/emails/${emailId}`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toBe(401)
      expect(res.body).toMatchObject({
        status: 401,
        title: 'Unauthorized',
        type: 'https://httpstatuses.org/401',
      })

      await app.cleanUp()
    })

    it('should return 403 when user does not have AdminPortalScope.serviceDesk scope', async () => {
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: adminNationalId,
          scope: [],
        }),
      })

      const server = request(app.getHttpServer())
      const emailId = uuid()

      const res = await server
        .delete(`/v2/users/.national-id/emails/${emailId}`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        detail: 'Forbidden resource',
        status: 403,
        title: 'Forbidden',
        type: 'https://httpstatuses.org/403',
      })

      await app.cleanUp()
    })
  })

  describe('With authentication', () => {
    let app: TestApp
    let server: SuperTest<Test>
    let fixtureFactory: FixtureFactory
    let userProfileModel: typeof UserProfile
    let emailsModel: typeof Emails
    let auditService: AuditService

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          nationalId: adminNationalId,
          scope: [AdminPortalScope.serviceDesk],
        }),
      })

      server = request(app.getHttpServer())
      fixtureFactory = new FixtureFactory(app)
      userProfileModel = app.get(getModelToken(UserProfile))
      emailsModel = app.get(getModelToken(Emails))
      auditService = app.get(AuditService)
    })

    beforeEach(async () => {
      jest.restoreAllMocks()
      await emailsModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      })
      await userProfileModel.destroy({
        where: {},
        cascade: true,
        force: true,
        truncate: true,
      })
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should successfully delete a non-primary email', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const emailToDelete = await fixtureFactory.createEmail({
        nationalId: testUserNationalId,
        email: 'delete-me@example.com',
        primary: false,
      })

      const emailBefore = await emailsModel.findOne({
        where: { id: emailToDelete.id },
      })
      expect(emailBefore).not.toBeNull()

      const res = await server
        .delete(`/v2/users/.national-id/emails/${emailToDelete.id}`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toBeTruthy()

      const emailAfter = await emailsModel.findOne({
        where: { id: emailToDelete.id },
      })
      expect(emailAfter).toBeNull()
    })

    it('should successfully delete a primary email', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const primaryEmail = await fixtureFactory.createEmail({
        nationalId: testUserNationalId,
        email: 'primary@example.com',
        primary: true,
      })

      const res = await server
        .delete(`/v2/users/.national-id/emails/${primaryEmail.id}`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(res.body).toBeTruthy()

      const emailAfter = await emailsModel.findOne({
        where: { id: primaryEmail.id },
      })
      expect(emailAfter).toBeNull()
    })

    it('should invoke audit logging', async () => {
      const auditSpy = jest.spyOn(auditService, 'auditPromise')

      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const emailToDelete = await fixtureFactory.createEmail({
        nationalId: testUserNationalId,
        email: 'audit-test@example.com',
        primary: false,
      })

      const res = await server
        .delete(`/v2/users/.national-id/emails/${emailToDelete.id}`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(200)
      expect(auditSpy).toHaveBeenCalled()

      const auditCall = auditSpy.mock.calls[0][0]
      expect(auditCall).toMatchObject({
        auth: expect.objectContaining({
          nationalId: adminNationalId,
        }),
        namespace: '@island.is/user-profile/v2/users',
        action: 'deleteEmail',
        resources: [testUserNationalId, emailToDelete.id],
      })
    })

    it('should return 400 when email does not exist', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const nonExistentEmailId = uuid()

      const res = await server
        .delete(`/v2/users/.national-id/emails/${nonExistentEmailId}`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
      })
    })

    it('should return 400 for invalid national ID', async () => {
      const emailId = uuid()

      const res = await server
        .delete(`/v2/users/.national-id/emails/${emailId}`)
        .set('X-Param-National-Id', 'invalid-national-id')

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
        detail: 'National id is not valid',
      })
    })

    it('should return 400 for invalid emailId format', async () => {
      await fixtureFactory.createUserProfile({
        nationalId: testUserNationalId,
        emails: [],
        mobilePhoneNumber: testUserPhone,
      })

      const res = await server
        .delete(`/v2/users/.national-id/emails/not-a-uuid`)
        .set('X-Param-National-Id', testUserNationalId)

      expect(res.status).toEqual(400)
      expect(res.body).toMatchObject({
        status: 400,
        title: 'Bad Request',
      })
    })
  })
})
