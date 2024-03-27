import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module'; // Import your AppModule

describe('MeNotificationsController', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = request(app.getHttpServer());
  });

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

  describe('Unauthenticated users', () => {
    it('GET /me/notifications should return 401', async () => {
      // Make an unauthenticated request
      const response = await server.get('/me/notifications');

      expect(response.status).toBe(401);
      // Additional assertions can be added here
    });

    // Additional tests for other endpoints and HTTP methods
  });

  afterAll(async () => {
    await app.close();
  });
});
