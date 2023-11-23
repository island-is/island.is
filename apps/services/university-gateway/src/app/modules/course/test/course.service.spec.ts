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

const currentUser = createCurrentUser()

describe('CourseService', () => {
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

  describe('getCourses', () => {
    it('should return 10 courses for university', async () => {
      const numPrograms = 2
      const numCourses = 5

      for (let i = 0; i < numPrograms; i++) {
        const program = await fixtureFactory.createProgram({
          universityId: universityId,
          durationInYears: 3,
        })
        assert(program)

        for (let j = 0; j < numCourses; j++) {
          const course = await fixtureFactory.createCourse({
            programId: program.id,
          })
          assert(course)
        }
      }

      const result = await server.get(
        `/v1/courses?universityId=${universityId}`,
      )

      expect(result.status).toBe(200)
      expect(result.body.totalCount).toEqual(numPrograms * numCourses)
    })

    it('should return 5 courses for program', async () => {
      const numCourses = 5

      const program = await fixtureFactory.createProgram({
        universityId: universityId,
        durationInYears: 3,
      })
      assert(program)

      for (let i = 0; i < numCourses; i++) {
        const course = await fixtureFactory.createCourse({
          programId: program.id,
        })
        assert(course)
      }

      const result = await server.get(`/v1/courses?programId=${program.id}`)

      expect(result.status).toBe(200)
      expect(result.body.totalCount).toEqual(numCourses)
    })
  })

  describe('getCourseById', () => {
    it('should return course', async () => {
      const program = await fixtureFactory.createProgram({
        universityId: universityId,
        durationInYears: 3,
      })
      assert(program)

      const course = await fixtureFactory.createCourse({
        programId: program.id,
      })
      assert(course)

      const result = await server.get(`/v1/courses/${course.id}`)

      expect(result.status).toBe(200)
      expect(result.body).toMatchObject(JSON.parse(JSON.stringify(course)))
    })

    it('should not find course', async () => {
      const randomId = faker.datatype.uuid()

      const result = await server.get(`/v1/courses/${randomId}`)

      expect(result.status).toBe(HttpStatus.NO_CONTENT)
    })
  })
})
