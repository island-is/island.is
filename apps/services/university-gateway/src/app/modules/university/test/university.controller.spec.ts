import { Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import assert from 'assert'
import { Sequelize } from 'sequelize-typescript'
import request, { SuperTest, Test } from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { TestApp, setupApp, truncate } from '@island.is/testing/nest'
import { FixtureFactory } from '../../../../../test/fixtureFactory'
import { SequelizeConfigService } from '../../../../sequelizeConfig.service'
import { AppModule } from '../../../app.module'

const currentUser = createCurrentUser()

describe('UniversityController', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let sequelize: Sequelize

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
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

  describe('GET /universities', () => {
    it('should return 5 universities', async () => {
      const numUniversities = 5

      for (let i = 0; i < numUniversities; i++) {
        const university = await fixtureFactory.createUniversity()
        assert(university)
      }

      const result = await server.get('/v1/universities')

      expect(result.status).toBe(200)
      expect(result.body.data.length).toEqual(numUniversities)
    })
  })
})
