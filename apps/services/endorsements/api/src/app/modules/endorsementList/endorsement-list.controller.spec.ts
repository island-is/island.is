import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import {
  TestApp,
  setupApp,
  setupAppWithoutAuth,
  truncate,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { EndorsementsScope, AdminPortalScope } from '@island.is/auth/scopes'
// import { FixtureFactory } from '../../../test/fixtureFactory'
import { AppModule } from '../../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'


import { Injectable } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { EndorsementList } from './endorsementList.model'
import { v4 as uuid } from 'uuid'

@Injectable()
export class FixtureFactory {
  private endorsementListModel: typeof EndorsementList

  constructor(private app: TestApp) {
    this.endorsementListModel = this.app.get<typeof EndorsementList>(
      getModelToken(EndorsementList),
    )
  }

  async createEndorsementList(input: Partial<EndorsementList> = {}) {
    const defaults = {
      id: uuid(),
      title: 'Test Endorsement List',
      description: 'Test Description',
      owner: '0101303099',
      openedDate: new Date(),
      closedDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      tags: ['test-tag'],
      meta: {},
      adminLock: false,
      endorsementCount: 0,
    }

    return await this.endorsementListModel.create({
      ...defaults,
      ...input,
    })
  }

  async createEndorsementLists(count: number, input: Partial<EndorsementList> = {}) {
    const lists = []
    for (let i = 0; i < count; i++) {
      lists.push(await this.createEndorsementList(input))
    }
    return lists
  }
}

describe('EndorsementListController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let fixtureFactory: FixtureFactory
  let sequelize: Sequelize

  beforeAll(async () => {
    // We set this up in the general beforeAll but will override user per describe block
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      dbType: 'postgres',  // Specify postgres as the db type for tests

    })

    fixtureFactory = new FixtureFactory(app)
    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
    server = request(app.getHttpServer())
  })

  afterEach(async () => {
    await truncate(sequelize)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('GET /endorsement-list - No Auth', () => {
    it('should return 401 when user is not authenticated', async () => {
      const app = await setupAppWithoutAuth({
        AppModule,
        SequelizeConfigService,
        dbType: 'postgres',  // Specify postgres as the db type for tests

      })
      const server = request(app.getHttpServer())

      const res = await server.get('/endorsement-list')

      expect(res.status).toBe(401)

      await app.cleanUp()
    })
  })

  describe('GET /endorsement-list - With Auth No Scope', () => {
    it('should return 403 when user lacks required scope', async () => {
      const app = await setupApp({
        AppModule,
        SequelizeConfigService,
        dbType: 'postgres',  // Specify postgres as the db type for tests

        user: createCurrentUser({}), // No scopes
      })
      const server = request(app.getHttpServer())

      const res = await server.get('/endorsement-list')

      expect(res.status).toBe(403)

      await app.cleanUp()
    })
  })

})
