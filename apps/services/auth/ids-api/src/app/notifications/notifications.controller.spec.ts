import faker from 'faker'
import request from 'supertest'

import { SmsService } from '@island.is/nova-sms'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  TestApp,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutPermission,
} from '../../../test/setup'

describe('NotificationsController', () => {
  describe('with authentication', () => {
    const user = createCurrentUser({
      scope: ['@identityserver.api/authentication'],
    })

    let app: TestApp
    let server: request.SuperTest<request.Test>
    let smsService: SmsService

    beforeAll(async () => {
      app = await setupWithAuth({ user })

      smsService = app.get<SmsService>(SmsService)
      jest.spyOn(smsService, 'sendSms').mockImplementation()

      server = request(app.getHttpServer())
    })

    afterAll(() => {
      app.cleanUp()
    })

    it('should send sms', async () => {
      const spy = jest.spyOn(smsService, 'sendSms')

      const res = await server.post(`/v1/notifications/sms`).send({
        toPhoneNumber: faker.phone.phoneNumber('#######'),
        content: faker.random.word(),
      })

      expect(res.status).toEqual(202)
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('withoutAuth and permission', () => {
    it.each`
      method    | endpoint
      ${'POST'} | ${'/v1/notifications/sms'}
    `(
      '$method $endpoint should return 401 when request is not authenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutAuth()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
        expect(res.body).toMatchObject({
          status: 401,
          type: 'https://httpstatuses.org/401',
          title: 'Unauthorized',
        })

        // CleanUp
        app.cleanUp()
      },
    )

    it.each`
      method    | endpoint
      ${'POST'} | ${'/v1/notifications/sms'}
    `(
      '$method $endpoint should return 403 Forbidden when request does not have the correct scope',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupWithoutPermission()
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)
        expect(res.body).toMatchObject({
          status: 403,
          type: 'https://httpstatuses.org/403',
          title: 'Forbidden',
          detail: 'Forbidden resource',
        })

        // CleanUp
        app.cleanUp()
      },
    )
  })
})
