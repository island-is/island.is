import { HttpStatus, Type } from '@nestjs/common'
import { getConnectionToken } from '@nestjs/sequelize'
import assert from 'assert'
import { Sequelize } from 'sequelize-typescript'
import request, { SuperTest, Test } from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { TestApp, setupApp, truncate } from '@island.is/testing/nest'
import { FixtureFactory } from '../../../../../test/fixtureFactory'
import { SequelizeConfigService } from '../../../../sequelizeConfig.service'
import { AppModule } from '../../../app.module'
import faker from 'faker'
import { ModeOfDelivery } from '@island.is/university-gateway'

const currentUser = createCurrentUser()

describe('ProgramController', () => {
  let app: TestApp
  let server: SuperTest<Test>
  let fixtureFactory: FixtureFactory
  let sequelize: Sequelize
  let universityId: string

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

  beforeEach(async () => {
    const university = await fixtureFactory.createUniversity()
    assert(university)
    universityId = university.id
  })

  afterEach(async () => {
    await truncate(sequelize)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  describe('GET /programs', () => {
    it('should return 5 programs', async () => {
      const numPrograms = 5

      for (let i = 0; i < numPrograms; i++) {
        const program = await fixtureFactory.createProgram({
          universityId: universityId,
          durationInYears: 3,
          modeOfDeliveryList: [ModeOfDelivery.ON_SITE],
        })
        assert(program)
      }

      const result = await server.get('/v1/programs')

      expect(result.status).toBe(200)
      expect(result.body.totalCount).toEqual(numPrograms)
    })
  })

  describe('GET /programs/{id}', () => {
    it('should return program', async () => {
      const program = await fixtureFactory.createProgram({
        universityId: universityId,
        durationInYears: 3,
        modeOfDeliveryList: [ModeOfDelivery.ON_SITE, ModeOfDelivery.ONLINE],
      })
      assert(program)

      const result = await server.get(`/v1/programs/${program.id}`)

      expect(result.status).toBe(200)
      // Note: the JSON.parse(JSON.stringify()) is needed to match date fields that are passed over the wire as they are strings on the response object.
      expect(result.body).toMatchObject(JSON.parse(JSON.stringify(program)))
    })

    it('should not find program', async () => {
      const randomId = faker.datatype.uuid()

      const result = await server.get(`/v1/programs/${randomId}`)

      expect(result.status).toBe(HttpStatus.NO_CONTENT)
    })
  })

  describe('GET /duration-in-years', () => {
    it('should return unique list of duration in years', async () => {
      const possibleDurations = [2, 3, 5]

      // create five programs with each possible duration
      for (let i = 0; i < possibleDurations.length; i++) {
        const cntPrograms = 5
        for (let j = 0; j < cntPrograms; j++) {
          const program = await fixtureFactory.createProgram({
            universityId: universityId,
            durationInYears: possibleDurations[i],
            modeOfDeliveryList: [ModeOfDelivery.ON_SITE],
          })
          assert(program)
        }
      }

      const result = await server.get('/v1/duration-in-years')

      expect(result.status).toBe(200)
      expect(result.body.length).toEqual(possibleDurations.length)
    })
  })
})
