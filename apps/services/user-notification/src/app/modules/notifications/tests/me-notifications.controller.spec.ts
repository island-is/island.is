import request from 'supertest'

import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { AppModule } from '../../../app.module'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { DocumentsScope } from '@island.is/auth/scopes'

beforeAll(async () => {
  process.env.INIT_SCHEMA = 'true' // Disabling Firebase init
})

describe('MeNotificationsController - No Auth', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/v1/me/notifications'}
    ${'GET'}   | ${'/v1/me/notifications/some-notification-id'}
    ${'GET'}   | ${'/v1/me/notifications/unread-count'}
    ${'GET'}   | ${'/v1/me/notifications/unseen-count'}
    ${'PATCH'} | ${'/v1/me/notifications/some-notification-id'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-seen'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-read'}
  `(
    '$method $endpoint should return 401 when user is unauthenticated',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupAppWithoutAuth({
        AppModule: AppModule,
        SequelizeConfigService: SequelizeConfigService,
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(401)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - With Auth No Scope', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/v1/me/notifications'}
    ${'GET'}   | ${'/v1/me/notifications/some-notification-id'}
    ${'GET'}   | ${'/v1/me/notifications/unread-count'}
    ${'GET'}   | ${'/v1/me/notifications/unseen-count'}
    ${'PATCH'} | ${'/v1/me/notifications/some-notification-id'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-seen'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-read'}
  `(
    '$method $endpoint should return 403 when user is unauthorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({}),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(403)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - GET With Auth And Scope', () => {
  it.each`
    method   | endpoint
    ${'GET'} | ${'/v1/me/notifications/unread-count'}
    ${'GET'} | ${'/v1/me/notifications/unseen-count'}
  `(
    '$method $endpoint should return 200 when user is authorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [DocumentsScope.main],
        }),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(200)

      app.cleanUp()
    },
  )
})

describe('MeNotificationsController - PATCH With Auth And Scope', () => {
  it.each`
    method     | endpoint
    ${'PATCH'} | ${'/v1/me/notifications/some-notification-id'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-seen'}
    ${'POST'}  | ${'/v1/me/notifications/mark-all-as-read'}
  `(
    '$method $endpoint should return 204 when user is authorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [DocumentsScope.main],
        }),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(204)

      app.cleanUp()
    },
  )
})
