import request from 'supertest'

import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  getRequestMethod,
  setupApp,
  setupAppWithoutAuth,
  TestEndpointOptions,
} from '@island.is/testing/nest'

import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { EndorsementsScope, AdminPortalScope } from '@island.is/auth/scopes'

describe('EndorsementListController - No Auth', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/endorsement-list'}
    ${'GET'}   | ${'/endorsement-list/general-petition-lists'}
    ${'GET'}   | ${'/endorsement-list/general-petition-list/some-id'}
    ${'GET'}   | ${'/endorsement-list/some-id/ownerInfo'}
    ${'POST'}  | ${'/endorsement-list'}
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

describe('EndorsementListController - With Auth No Scope', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/endorsement-list'}
    ${'GET'}   | ${'/endorsement-list/general-petition-lists'}
    ${'GET'}   | ${'/endorsement-list/general-petition-list/some-id'}
    ${'GET'}   | ${'/endorsement-list/some-id'}
    ${'POST'}  | ${'/endorsement-list'}
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

describe('EndorsementListController - With Auth And Scope', () => {
  it.each`
    method     | endpoint
    ${'GET'}   | ${'/endorsement-list'}
    ${'GET'}   | ${'/endorsement-list/general-petition-lists'}
    ${'GET'}   | ${'/endorsement-list/general-petition-list/some-id'}
    ${'GET'}   | ${'/endorsement-list/some-id'}
    ${'POST'}  | ${'/endorsement-list'}
  `(
    '$method $endpoint should return 200 or 204 when user is authorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [EndorsementsScope.main, AdminPortalScope.petitionsAdmin],
        }),
      })
      const server = request(app.getHttpServer())

      //Act
      const res = await getRequestMethod(server, method)(endpoint)

      //Assert
      expect(res.status).toEqual(method === 'POST' ? 201 : 200)

      app.cleanUp()
    },
  )

  it.each`
    method     | endpoint
    ${'PUT'}   | ${'/endorsement-list/some-id/close'}
    ${'PUT'}   | ${'/endorsement-list/some-id/open'}
    ${'PUT'}   | ${'/endorsement-list/some-id/lock'}
    ${'PUT'}   | ${'/endorsement-list/some-id/unlock'}
    ${'PUT'}   | ${'/endorsement-list/some-id/update'}
    ${'POST'}  | ${'/endorsement-list/some-id/email-pdf'}
  `(
    '$method $endpoint should return 204 when user is authorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      //Arrange
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        user: createCurrentUser({
          scope: [EndorsementsScope.main, AdminPortalScope.petitionsAdmin],
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
