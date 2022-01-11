import {
  setupWithoutAuth,
  setupWithAuth,
  setupWithoutScope,
} from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { PersonalRepresentativeType } from '@island.is/auth-api-lib/personal-representative'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.adminPersonalRepresentative],
})

const simpleRequestData = {
  code: 'Code',
  name: 'Name',
  description: 'Description',
}

const path = '/v1/personal-representative-types'

describe('PersonalRepresentativeTypesController - Without Scope', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithoutScope()
    server = request(app.getHttpServer())
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('POST /v1/personal-representative-types should fail and return 403 error if bearer is missing required scope', async () => {
    await server.post(path).send(simpleRequestData).expect(403)
  })
})

describe('PersonalRepresentativeTypesController - Without Auth', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithoutAuth()
    server = request(app.getHttpServer())
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('POST /v1/personal-representative-types should fail and return 401 error if bearer is missing', async () => {
    await server.post(path).send(simpleRequestData).expect(401)
  })
})

describe('PersonalRepresentativeTypesController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let prTypeModel: typeof PersonalRepresentativeType

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    // Get reference on personalRepresentativeType models to seed DB
    prTypeModel = app.get<typeof PersonalRepresentativeType>(
      'PersonalRepresentativeTypeRepository',
    )
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  beforeEach(async () => {
    await prTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
  })

  describe('Create', () => {
    it('POST /v1/personal-representative-types should return error when data is invalid', async () => {
      const requestData = {
        code: 'Code',
        description: 'Description',
        validFrom: '10-11-2021',
      }
      const response = await server.post(path).send(requestData).expect(400)

      expect(response.body).toMatchObject({
        ...errorExpectedStructure,
        statusCode: 400,
      })
    })

    it('POST /v1/personal-representative-types should create a new entry', async () => {
      const response = await server
        .post(path)
        .send(simpleRequestData)
        .expect(201)
      expect(response.body).toMatchObject(simpleRequestData)
    })
  })

  describe('Update', () => {
    it('Put /v1/personal-representative-types should update type with new description', async () => {
      await server.post(path).send(simpleRequestData)

      const requestData = {
        ...simpleRequestData,
        description: 'DescriptionUpdated',
      }

      const response = await server
        .put(`${path}/${requestData.code}`)
        .send(requestData)
        .expect(200)

      expect(response.body).toMatchObject(requestData)
    })

    it('Put /v1/personal-representative-types should fail with 400 on code descreptancy', async () => {
      await server.post(path).send(simpleRequestData)

      const requestData = {
        code: 'NotSameAsBefore',
        description: 'DescriptionUpdated',
      }

      await server
        .put(`${path}/${requestData.code}`)
        .send(requestData)
        .expect(400)
    })
  })

  describe('Get', () => {
    it('Get /v1/personal-representative-types should return a list of types', async () => {
      await server.post(path).send(simpleRequestData)
      const response = await server
        .get(`${path}/${simpleRequestData.code}`)
        .expect(200)

      expect(response.body.code).toMatch(simpleRequestData.code)
      expect(response.body.description).toMatch(simpleRequestData.description)
    })
  })

  describe('Delete/Remove', () => {
    it('Delete /v1/personal-representative-types mark type as invalid', async () => {
      await server.post(path).send(simpleRequestData)
      await server.delete(`${path}/${simpleRequestData.code}`).expect(204)

      const response = await request(app.getHttpServer()).get(
        `${path}/${simpleRequestData.code}`,
      )

      expect(response.body.code).toMatch(simpleRequestData.code)
      expect(response.body.description).toMatch(simpleRequestData.description)
      expect(response.body.validTo).not.toBeNull()
    })
  })
})
