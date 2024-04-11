import request, { SuperTest, Test } from 'supertest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../../../app.module'
import { setupApp, setupAppWithoutAuth, TestApp } from '@island.is/testing/nest'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { UserProfileScope } from '@island.is/auth/scopes'
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
      process.env.INIT_SCHEMA = 'true'; // Example of disabling Firebase init

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

      await app.cleanUp()
    })
  })

  describe('With auth', () => {
    let app: TestApp
    let server: SuperTest<Test>

    beforeAll(async () => {
      app = await setupApp({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
        user: createCurrentUser({
          scope: [UserProfileScope.read],
          nationalId: testUserProfile.nationalId,
        }),
      })

      server = request(app.getHttpServer())
    })

    // afterAll(async () => {
    //   await app.cleanUp()
    // })

    it('GET /me/notifications should return 200 when user is authenticated', async () => {
      // Act
      const res = await server.get('/v1/me/notifications')

      // Assert
      expect(res.status).toBe(200)
    })

    // it('GET me/notification/unread-count should return 200 when user is authenticated', async () => {
    //   // Act
    //   const res = await server
    //     .get('/v1/me/notifications/unread-count')
    //     .set('Authorization', 'Bearer simulated-token-with-correct-scopes')

    //   // Assert
    //   expect(res.status).toBe(200)
    // })

    // it('GET me/notification/unseen-count should return 200 when user is authenticated', async () => {
    //   // Act
    //   const res = await server
    //     .get('/v1/me/notifications/unseen-count')
    //     .set('Authorization', 'Bearer simulated-token-with-correct-scopes')

    //   // Assert
    //   expect(res.status).toBe(200)
    // })

    // it('GET me/notification/:id should return 200 when user is authenticated', async () => {
    //   // Act
    //   const res = await server
    //     .get('/v1/me/notifications/1')
    //     .set('Authorization', 'Bearer simulated-token-with-correct-scopes')

    //   // Assert
    //   expect(res.status).toBe(200)
    // })

    // it('PATCH me/notification/mark-all-as-seen should return 200 when user is authenticated', async () => {
    //   // Act
    //   const res = await server
    //     .patch('/v1/me/notifications/mark-all-as-seen')
    //     .set('Authorization', 'Bearer simulated-token-with-correct-scopes')

    //   // Assert
    //   expect(res.status).toBe(200)
    // })
  })

  // it('GET  should return 401 when user is not authenticated', async () => {
  //   // Arrange
  //   const app = await setupAppWithoutAuth({
  //     AppModule: AppModule,
  //     SequelizeConfigService: SequelizeConfigService,
  //   })

  //   const server = request(app.getHttpServer())

  //   // Act
  //   const res = await server.get('/v1/me/notifications')

  //   // Assert
  //   expect(res.status).toBe(401)

  //   await app.cleanUp()
  // })

  // describe('Authenticated users with correct scopes', () => {
  //   it('GET /me/notifications should return 200', async () => {
  //     // Simulate an authenticated request with correct scopes
  //     const response = await server
  //       .get('/me/notifications')
  //       .set('Authorization', 'Bearer simulated-token-with-correct-scopes');

  //     expect(response.status).toBe(200);
  //     // Further assertions to check the response body can be added here
  //   });

  //   // Additional tests for other endpoints and HTTP methods
  // });

  // describe('Users with missing scopes', () => {
  //   it('GET /me/notifications should return 403', async () => {
  //     // Simulate an authenticated request without required scopes
  //     const response = await server
  //       .get('/me/notifications')
  //       .set('Authorization', 'Bearer simulated-token-without-required-scopes');

  //     expect(response.status).toBe(403);
  //     // Additional assertions can be added here
  //   });

  //   // Additional tests for other endpoints and HTTP methods
  // });

  // describe('Unauthenticated users', () => {
  //   it('GET /me/notifications should return 401', async () => {
  //     // Make an unauthenticated request
  //     const response = await server.get('/me/notifications');

  //     expect(response.status).toBe(401);
  //     // Additional assertions can be added here
  //   });

  //   // Additional tests for other endpoints and HTTP methods
  // });

  // afterAll(async () => {
  //   await app.close();
  // });
})
