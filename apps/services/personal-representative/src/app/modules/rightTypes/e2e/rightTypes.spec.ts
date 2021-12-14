import { setupWithAuth, setupWithoutAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { PersonalRepresentativeRightType } from '@island.is/auth-api-lib/personal-representative'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'

const scopes = ['@island.is/scope0', '@island.is/scope1']
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.writePersonalRepresentative, scopes[0]],
})

const simpleRequestData = {
  code: 'Code',
  description: 'Description',
}

describe('RightTypesController - Without Auth', () => {
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

  it('POST /v1/right-types should fail and return 403 error if bearer is missing', async () => {
    const response = await server
      .post('/v1/right-types')
      .send(simpleRequestData)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
})

describe('RightTypesController - With Auth', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let prRightTypeModel: typeof PersonalRepresentativeRightType

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    // Get reference on rightType models to seed DB
    prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
      'PersonalRepresentativeRightTypeRepository',
    )
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  beforeEach(async () => {
    await prRightTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })

    describe('Create Right Type', () => {
      it('POST /v1/right-types should return error when data is invalid', async () => {
        const requestData = {
          code: 'Code',
          description: 'Description',
          validFrom: '10-11-2021',
        }
        const response = await server
          .post('/v1/right-types')
          .send(requestData)
          .expect(400)

        expect(response.body).toMatchObject({
          ...errorExpectedStructure,
          statusCode: 400,
        })
      })

      it('POST /v1/right-types should create a new entry', async () => {
        const response = await server
          .post('/v1/right-types')
          .send(simpleRequestData)
          .expect(201)
        expect(response.body).toMatchObject(simpleRequestData)
      })
    })

    describe('Update Right Type', () => {
      it('Put /v1/right-types should update right type with new description', async () => {
        await server.post('/v1/right-types').send(simpleRequestData)

        const requestData = {
          ...simpleRequestData,
          description: 'DescriptionUpdated',
        }

        const response = await server
          .put(`/v1/right-types/${requestData.code}`)
          .send(requestData)
          .expect(200)

        expect(response.body).toMatchObject(requestData)
      })
    })

    describe('Get Right Type/s', () => {
      it('Get /v1/right-types should return a list of right types', async () => {
        await server.post('/v1/right-types').send(simpleRequestData)
        const response = await server
          .get(`/v1/right-types/${simpleRequestData.code}`)
          .expect(200)

        expect(response.body.code).toMatch(simpleRequestData.code)
        expect(response.body.description).toMatch(simpleRequestData.description)
      })
    })

    describe('Delete/Remove Right Type', () => {
      it('Delete /v1/right-types mark right type as invalid', async () => {
        await server.post('/v1/right-types').send(simpleRequestData)
        await server
          .delete(`/v1/right-types/${simpleRequestData.code}`)
          .send()
          .expect(200)

        const response = await request(app.getHttpServer()).get(
          `/v1/right-types/${simpleRequestData.code}`,
        )

        expect(response.body.code).toMatch(simpleRequestData.code)
        expect(response.body.description).toMatch(simpleRequestData.description)
        expect(response.body.validTo).not.toBeNull()
      })
    })
  })
})
