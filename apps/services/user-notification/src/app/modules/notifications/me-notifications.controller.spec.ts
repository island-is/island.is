import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module'; 
import { setupAppWithoutAuth } from '@island.is/testing/nest';
import { SequelizeConfigService } from '../../sequelizeConfig.service';

describe('MeNotificationsController', () => {
  let app: INestApplication;


  it('GET  should return 401 when user is not authenticated', async () => {
    // Arrange
    const app = await setupAppWithoutAuth({
      AppModule: AppModule,
      SequelizeConfigService: SequelizeConfigService,
    })

    const server = request(app.getHttpServer())

    // Act
    const res = await server
      .get('/v1/me/notifications')
      
    // Assert
    expect(res.status).toBe(401)


    await app.cleanUp()
  })

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
});
