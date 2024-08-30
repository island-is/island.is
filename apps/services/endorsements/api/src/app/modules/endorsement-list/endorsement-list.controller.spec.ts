import { Test, TestingModule } from '@nestjs/testing'
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
import { AdminPortalScope, EndorsementsScope } from '@island.is/auth/scopes'
import { EndorsementListService } from './endorsement-list.service'

jest.mock('./endorsement-list.service') // Mocking the service

describe('EndorsementListController', () => {
  let app: any
  let server: any
  let endorsementListService: EndorsementListService

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EndorsementListService)
      .useValue({
        findListsByTags: jest.fn().mockResolvedValue([]), // Mock implementation
        findOpenListsTaggedGeneralPetition: jest.fn().mockResolvedValue([]),
        findSingleList: jest.fn().mockResolvedValue(null),
        findAllEndorsementsByNationalId: jest.fn().mockResolvedValue([]),
        findAllEndorsementListsByNationalId: jest.fn().mockResolvedValue([]),
        close: jest.fn().mockResolvedValue({}),
        open: jest.fn().mockResolvedValue({}),
        lock: jest.fn().mockResolvedValue({}),
        unlock: jest.fn().mockResolvedValue({}),
        updateEndorsementList: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
        getOwnerInfo: jest.fn().mockResolvedValue('owner-info'),
        emailPDF: jest.fn().mockResolvedValue({}),
        exportList: jest.fn().mockResolvedValue({}),
      })
      .compile()

    // Corrected setupApp usage to provide correct options
    app = await setupApp({
      AppModule, // Pass the module class, not the TestingModule instance
      SequelizeConfigService,
    })
    server = request(app.getHttpServer())
    endorsementListService = moduleRef.get<EndorsementListService>(
      EndorsementListService,
    )
  })

  afterAll(async () => {
    await app.close() // Corrected cleanup method
  })

  describe('No Auth', () => {
    it.each`
      method    | endpoint
      ${'GET'}  | ${'/v1/endorsement-list'}
      ${'GET'}  | ${'/v1/endorsement-list/general-petition-lists'}
      ${'GET'}  | ${'/v1/endorsement-list/general-petition-list/some-list-id'}
      ${'GET'}  | ${'/v1/endorsement-list/endorsements'}
      ${'GET'}  | ${'/v1/endorsement-list/endorsementLists'}
      ${'GET'}  | ${'/v1/endorsement-list/some-list-id'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/close'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/open'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/lock'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/unlock'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/update'}
      ${'POST'} | ${'/v1/endorsement-list'}
    `(
      '$method $endpoint should return 401 when user is unauthenticated',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(401)
      },
    )
  })

  describe('With Auth No Scope', () => {
    it.each`
      method    | endpoint
      ${'GET'}  | ${'/v1/endorsement-list'}
      ${'GET'}  | ${'/v1/endorsement-list/endorsements'}
      ${'GET'}  | ${'/v1/endorsement-list/endorsementLists'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/close'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/open'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/lock'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/unlock'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/update'}
      ${'POST'} | ${'/v1/endorsement-list'}
    `(
      '$method $endpoint should return 403 when user is unauthorized',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({}), // Mock user without any scope
        })
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(403)

        await app.close() // Corrected cleanup method for nested app instance
      },
    )
  })

  describe('With Auth and Valid Scope', () => {
    it.each`
      method   | endpoint
      ${'GET'} | ${'/v1/endorsement-list'}
      ${'GET'} | ${'/v1/endorsement-list/general-petition-lists'}
      ${'GET'} | ${'/v1/endorsement-list/general-petition-list/some-list-id'}
    `(
      '$method $endpoint should return 200 when user is authorized',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            scope: [EndorsementsScope.main],
          }),
        })
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(200)

        await app.close() // Corrected cleanup method for nested app instance
      },
    )

    it.each`
      method    | endpoint
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/close'}
      ${'PUT'}  | ${'/v1/endorsement-list/some-list-id/open'}
      ${'POST'} | ${'/v1/endorsement-list'}
    `(
      '$method $endpoint should return 204 when user is authorized',
      async ({ method, endpoint }: TestEndpointOptions) => {
        // Arrange
        const app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            scope: [EndorsementsScope.main, AdminPortalScope.petitionsAdmin],
          }),
        })
        const server = request(app.getHttpServer())

        // Act
        const res = await getRequestMethod(server, method)(endpoint)

        // Assert
        expect(res.status).toEqual(204)

        await app.close() // Corrected cleanup method for nested app instance
      },
    )
  })
})
