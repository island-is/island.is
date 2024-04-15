import request, { SuperTest, Test } from 'supertest'
import { AppModule } from '../../../app.module'
import { setupApp, setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { NotificationsScope } from '@island.is/auth/scopes'
import {
  createCurrentUser,
  createNationalId,
  createPhoneNumber,
} from '@island.is/testing/fixtures'
import faker from 'faker'

const testUserProfile = {
  nationalId: createNationalId(),
  email: faker.internet.email(),
  mobilePhoneNumber: createPhoneNumber(),
}

describe('MeNotificationsController', () => {
  describe('No auth', () => {
    let app: TestApp
    let server: SuperTest<Test>

    beforeAll(async () => {
      process.env.INIT_SCHEMA = 'true' // Disabling Firebase init

      app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })

      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('GET /me/notifications should return 401 when user is not authenticated', async () => {
      // Act
      const res = await server.get('/v1/me/notifications')

      // Assert
      expect(res.status).toBe(401)
    })

    it('GET me/notification/unread-count should return 401 when user is not authenticated', async () => {
      const server = request(app.getHttpServer())

      // Act
      const res = await server.get('/v1/me/notifications/unread-count')

      // Assert
      expect(res.status).toBe(401)
    })

    it('GET me/notification/unseen-count should return 401 when user is not authenticated', async () => {
      const server = request(app.getHttpServer())

      // Act
      const res = await server.get('/v1/me/notifications/unseen-count')

      // Assert
      expect(res.status).toBe(401)
    })

    it('GET me/notification/:id should return 401 when user is not authenticated', async () => {
      const server = request(app.getHttpServer())

      // Act
      const res = await server.get('/v1/me/notifications/1')

      // Assert
      expect(res.status).toBe(401)
    })

    it('PATCH me/notification/mark-all-as-seen should return 401 when user is not authenticated', async () => {
      const server = request(app.getHttpServer())

      // Act
      const res = await server.patch('/v1/me/notifications/mark-all-as-seen')

      // Assert
      expect(res.status).toBe(401)
    })
  })

  describe('With auth but wrong scope', () => {
    let app: TestApp
    let server: SuperTest<Test>

    beforeAll(async () => {
      app = await setupApp({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
        user: createCurrentUser({
          nationalId: testUserProfile.nationalId,
        }),
      })

      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('GET /me/notifications should return 403', async () => {
      const response = await server.get('/v1/me/notifications')

      // Assert
      expect(response.status).toBe(403)
    })

    it('GET me/notification/unread-count should return 403', async () => {
      const response = await server.get('/v1/me/notifications/unread-count')

      // Assert
      expect(response.status).toBe(403)
    })

    it('GET me/notification/unseen-count should return 403', async () => {
      const response = await server.get('/v1/me/notifications/unseen-count')

      // Assert
      expect(response.status).toBe(403)
    })

    it('GET me/notification/:id should return 403', async () => {
      const response = await server.get('/v1/me/notifications/1')

      // Assert
      expect(response.status).toBe(403)
    })

    it('PATCH me/notification/mark-all-as-seen should return 403', async () => {
      const response = await server.patch(
        '/v1/me/notifications/mark-all-as-seen',
      )

      // Assert
      expect(response.status).toBe(403)
    })
  })

  describe('With auth and correct scope', () => {
    let app: TestApp
    let server: SuperTest<Test>

    beforeAll(async () => {
      app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [NotificationsScope.read, NotificationsScope.write],
        }),
      })

      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('GET /me/notifications should return 200', async () => {
      // Act
      const res = await server.get('/v1/me/notifications')

      // Assert
      expect(res.status).toEqual(200)
    })

    it('GET me/notification/unread-count should return 200', async () => {
      // Act
      const res = await server.get('/v1/me/notifications/unread-count')

      // Assert
      expect(res.status).toEqual(200)
    })

    it('GET me/notification/unseen-count should return 200', async () => {
      // Act
      const res = await server.get('/v1/me/notifications/unseen-count')

      // Assert
      expect(res.status).toEqual(200)
    })

    it('GET me/notification/:id should return 204', async () => {
      // Act
      const res = await server.get('/v1/me/notifications/1')

      // Assert
      expect(res.status).toEqual(204)
    })

    it('PATCH me/notification/mark-all-as-seen should return 200', async () => {
      // Act
      const res = await server
        .patch('/v1/me/notifications/mark-all-as-seen')
        .send({ read: true, seen: true, unreadCount: 1, unseenCount: 1 })

      // Assert
      expect(res.status).toEqual(204)
    })
  })
})
