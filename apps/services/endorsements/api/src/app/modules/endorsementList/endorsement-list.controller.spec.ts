import { getModelToken } from '@nestjs/sequelize'
import request from 'supertest'
import { EndorsementListController } from './endorsementList.controller'
import { EndorsementListService } from './endorsementList.service'
import type { TestApp } from '@island.is/testing/nest'
import { setupApp, setupAppWithoutAuth } from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { EndorsementsScope, AdminPortalScope } from '@island.is/auth/scopes'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { EndorsementList } from './endorsementList.model'
import { EmailService } from '@island.is/email-service'
import { AwsService } from '@island.is/nest/aws'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { AppModule } from '../../app.module'

describe('EndorsementListController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  const mockEndorsementList = {
    id: '12345',
    title: 'Test Endorsement List',
    description: 'Test description',
    owner: '1234567890',
    openedDate: new Date(),
    closedDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    endorsementMetadata: [],
    tags: [],
    meta: {},
    adminLock: false,
    endorsementCount: 0,
  }

  describe('Without auth', () => {
    beforeAll(async () => {
      app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
      })
      server = request(app.getHttpServer())
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it.each([
      ['GET', '/endorsement-list'],
      ['POST', '/endorsement-list'],
      ['GET', '/endorsement-list/12345'],
      ['PUT', '/endorsement-list/12345/close'],
      ['PUT', '/endorsement-list/12345/lock'],
    ])(
      '%s %s should return 401 when user is not authenticated',
      async (method, path) => {
        const res = await (server as any)[method.toLowerCase()](path)

        expect(res.status).toBe(401)
        expect(res.body).toMatchObject({
          status: 401,
          title: 'Unauthorized',
          type: 'https://httpstatuses.org/401',
        })
      },
    )
  })

  describe('With auth', () => {
    describe('with endorsement scope', () => {
      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            scope: [EndorsementsScope.main],
          }),
        })

        server = request(app.getHttpServer())
        const endorsementListService = app.get(EndorsementListService)

        jest
          .spyOn(endorsementListService, 'findListsByTags')
          .mockResolvedValue({
            data: [mockEndorsementList],
            totalCount: 1,
            pageInfo: { hasNextPage: false },
          })
        jest
          .spyOn(endorsementListService, 'create')
          .mockResolvedValue(mockEndorsementList)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      describe('GET /endorsement-list', () => {
        it('should return list of endorsements', async () => {
          const res = await server
            .get('/endorsement-list')
            .query({ tags: ['test-tag'] })

          expect(res.status).toBe(200)
          expect(res.body).toMatchObject({
            data: [mockEndorsementList],
            totalCount: 1,
            pageInfo: { hasNextPage: false },
          })
        })
      })

      describe('POST /endorsement-list', () => {
        it('should create new endorsement list', async () => {
          const newList = {
            title: 'New List',
            description: 'New description',
            openedDate: new Date(),
            closedDate: new Date(
              new Date().setMonth(new Date().getMonth() + 1),
            ),
          }

          const res = await server.post('/endorsement-list').send(newList)

          expect(res.status).toBe(201)
          expect(res.body).toMatchObject(mockEndorsementList)
        })
      })
    })

    describe('with admin scope', () => {
      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            scope: [AdminPortalScope.petitionsAdmin],
          }),
        })

        server = request(app.getHttpServer())
        const endorsementListService = app.get(EndorsementListService)

        jest
          .spyOn(endorsementListService, 'findSingleList')
          .mockResolvedValue(mockEndorsementList)
        jest
          .spyOn(endorsementListService, 'lock')
          .mockResolvedValue(mockEndorsementList)
        jest
          .spyOn(endorsementListService, 'unlock')
          .mockResolvedValue(mockEndorsementList)
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      describe('PUT /endorsement-list/:id/lock', () => {
        it('should lock endorsement list', async () => {
          const res = await server.put('/endorsement-list/12345/lock')

          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(mockEndorsementList)
        })
      })

      describe('PUT /endorsement-list/:id/unlock', () => {
        it('should unlock endorsement list', async () => {
          const res = await server.put('/endorsement-list/12345/unlock')

          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(mockEndorsementList)
        })
      })
    })

    describe('without required scope', () => {
      beforeAll(async () => {
        app = await setupApp({
          AppModule,
          SequelizeConfigService,
          user: createCurrentUser({
            scope: ['some-other-scope'],
          }),
        })
        server = request(app.getHttpServer())
      })

      afterAll(async () => {
        await app.cleanUp()
      })

      it.each([
        ['GET', '/endorsement-list'],
        ['POST', '/endorsement-list'],
        ['PUT', '/endorsement-list/12345/lock'],
      ])(
        '%s %s should return 403 when user lacks required scope',
        async (method, path) => {
          const res = await server[method.toLowerCase()](path)

          expect(res.status).toBe(403)
          expect(res.body).toMatchObject({
            status: 403,
            title: 'Forbidden',
            detail: 'Forbidden resource',
            type: 'https://httpstatuses.org/403',
          })
        },
      )
    })
  })
})
