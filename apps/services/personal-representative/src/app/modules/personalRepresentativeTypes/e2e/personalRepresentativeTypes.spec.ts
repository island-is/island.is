import { setupWithoutAuth, setupWithAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { PersonalRepresentativeType } from '@island.is/auth-api-lib/personal-representative'
import { ApiScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [ApiScope.representativeWrite],
})

const simpleRequestData = {
  code: 'Code',
  name: 'Name',
  description: 'Description',
}

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

  it('POST /v1/personal-representative-types should fail and return 403 error if bearer is missing', async () => {
    const response = await server
      .post('/v1/personal-representative-types')
      .send(simpleRequestData)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
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
      const response = await server
        .post('/v1/personal-representative-types')
        .send(requestData)
        .expect(400)

      expect(response.body).toMatchObject({
        ...errorExpectedStructure,
        statusCode: 400,
      })
    })

    it('POST /v1/personal-representative-types should create a new entry', async () => {
      const response = await server
        .post('/v1/personal-representative-types')
        .send(simpleRequestData)
        .expect(201)
      expect(response.body).toMatchObject(simpleRequestData)
    })
  })

  describe('Update', () => {
    it('Put /v1/personal-representative-types should update type with new description', async () => {
      await server
        .post('/v1/personal-representative-types')
        .send(simpleRequestData)

      const requestData = {
        ...simpleRequestData,
        description: 'DescriptionUpdated',
      }

      const response = await server
        .put(`/v1/personal-representative-types/${requestData.code}`)
        .send(requestData)
        .expect(200)

      expect(response.body).toMatchObject(requestData)
    })
  })

  describe('Get', () => {
    it('Get /v1/personal-representative-types should return a list of types', async () => {
      await server
        .post('/v1/personal-representative-types')
        .send(simpleRequestData)
      const response = await server
        .get(`/v1/personal-representative-types/${simpleRequestData.code}`)
        .expect(200)

      expect(response.body.code).toMatch(simpleRequestData.code)
      expect(response.body.description).toMatch(simpleRequestData.description)
    })
  })

  describe('Delete/Remove', () => {
    it('Delete /v1/personal-representative-types mark type as invalid', async () => {
      await server
        .post('/v1/personal-representative-types')
        .send(simpleRequestData)
      await server
        .delete(`/v1/personal-representative-types/${simpleRequestData.code}`)
        .send()
        .expect(200)

      const response = await request(app.getHttpServer()).get(
        `/v1/personal-representative-types/${simpleRequestData.code}`,
      )

      expect(response.body.code).toMatch(simpleRequestData.code)
      expect(response.body.description).toMatch(simpleRequestData.description)
      expect(response.body.validTo).not.toBeNull()
    })
  })
})
