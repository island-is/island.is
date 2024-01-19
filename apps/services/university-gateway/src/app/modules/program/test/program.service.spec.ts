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
// import { ProgramService } from '../program.service'

const currentUser = createCurrentUser({
  scope: [
    // Here add scopes that protect API routes
  ],
})

describe('ProgramService', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  // let programService: ProgramService
  let sequelize: Sequelize

  beforeAll(async () => {
    app = await setupApp({
      AppModule,
      SequelizeConfigService,
      user: currentUser,
    })

    fixtureFactory = new FixtureFactory(app)
    // programService = app.get(ProgramService)
    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
    server = request(app.getHttpServer())
  })

  afterEach(async () => {
    await truncate(sequelize)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('getProgramById', () => {
    it('should return program', async () => {
      // It is nice to use the Arrange-Act-Assert pattern to structure the tests.
      // Sometimes the Arrange part can be skipped if it is handled in a beforeAll/beforeEach.

      const university = await fixtureFactory.createUniversity()
      // console.log('created mock university', { university })
      assert(university)

      const program = university.programs?.[0]
      assert(program)

      // Act
      // Instead of calling the service
      // const result = await programService.getProgramById(mockProgram.id)

      // We call the API endpoint to test the whole flow
      const result = await server.get(`/v1/programs/${program.id}`)
      // console.log(result.body)

      // Assert
      expect(result.status).toBe(200)

      // Note: the JSON.parse(JSON.stringify()) is needed to match date fields that are passed over the wire as they are strings on the response object.
      expect(result.body).toMatchObject(JSON.parse(JSON.stringify(program)))
    })
  })
})
