import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../../test/setup'
import {
  errorExpectedStructure,
  getRequestMethod,
} from '../../../../../test/testHelpers'
import { TestEndpointOptions } from '../../../../../test/types'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { PersonalRepresentativeRightType } from '@island.is/auth-api-lib'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { AuthScope } from '@island.is/auth/scopes'

const scopes = ['@island.is/scope0', '@island.is/scope1']
const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.adminPersonalRepresentative, scopes[0]],
})

const simpleRequestData = {
  code: 'Code',
  description: 'Description',
}

const path = '/v1/right-types'

describe('RightTypesController - Without Scope and Auth', () => {
  it.each`
    method      | endpoint
    ${'GET'}    | ${'/v1/right-types'}
    ${'GET'}    | ${'/v1/right-types/1234'}
    ${'POST'}   | ${'/v1/right-types'}
    ${'PUT'}    | ${'/v1/right-types/1234'}
    ${'DELETE'} | ${'/v1/right-types/1234'}
  `(
    '$method $endpoint should return 403 when user is without scope',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const app = await setupWithoutScope()
      const server = request(app.getHttpServer())

      // Act
      const res = await getRequestMethod(server, method)(endpoint)

      // Assert
      expect(res.status).toEqual(403)
      expect(res.body).toMatchObject({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      })

      // CleanUp
      app.cleanUp()
    },
  )

  it.each`
    method      | endpoint
    ${'GET'}    | ${'/v1/right-types'}
    ${'GET'}    | ${'/v1/right-types/1234'}
    ${'POST'}   | ${'/v1/right-types'}
    ${'PUT'}    | ${'/v1/right-types/1234'}
    ${'DELETE'} | ${'/v1/right-types/1234'}
  `(
    '$method $endpoint should return 401 when user is unauthorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const app = await setupWithoutAuth()
      const server = request(app.getHttpServer())

      // Act
      const res = await getRequestMethod(server, method)(endpoint)
      console.log(res.body)
      // Assert
      expect(res.status).toEqual(401)
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      })

      // CleanUp
      app.cleanUp()
    },
  )
})

describe('RightTypesController', () => {
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
  })

  describe('Create Right Type', () => {
    it('POST /v1/right-types should return error when data is invalid', async () => {
      const requestData = {
        description: 'Description',
        validFrom: '10-11-2021',
      }
      const response = await server.post(path).send(requestData).expect(400)

      expect(response.body).toMatchObject({
        ...errorExpectedStructure,
        statusCode: 400,
      })
    })

    it('POST /v1/right-types should create a new entry', async () => {
      const response = await server
        .post(path)
        .send(simpleRequestData)
        .expect(201)
      expect(response.body).toMatchObject(simpleRequestData)
    })
  })

  describe('Update Right Type', () => {
    it('Put /v1/right-types should update right type with new description', async () => {
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

    it('Put /v1/right-types should fail with 400 on code descreptancy', async () => {
      await server.post(path).send(simpleRequestData)

      const requestData = {
        code: 'NotSameAsBefore',
        description: 'DescriptionUpdated',
      }

      await server
        .put(`${path}/${simpleRequestData.code}`)
        .send(requestData)
        .expect(400)
    })
  })

  describe('Get Right Type/s', () => {
    it('Get /v1/right-types should return a specific right type', async () => {
      await server.post(path).send(simpleRequestData)

      const response = await server
        .get(`${path}/${simpleRequestData.code}`)
        .expect(200)

      expect(response.body.code).toEqual(simpleRequestData.code)
      expect(response.body.description).toEqual(simpleRequestData.description)
    })

    it('Get /v1/right-types should return right types', async () => {
      await server.post(path).send(simpleRequestData)

      const response = await server.get(path).expect(200)

      expect(response.body.totalCount).toEqual(1)
    })

    it('Get /v1/right-types should not return anything for a code that does not exist', async () => {
      await server.post(path).send(simpleRequestData)

      await server.get(`${path}/xxx`).expect(404)
    })
  })

  describe('Delete/Remove Right Type', () => {
    it('Delete /v1/right-types mark right type as invalid', async () => {
      await server.post(path).send(simpleRequestData)
      await server.delete(`${path}/${simpleRequestData.code}`).expect(204)

      const response = await request(app.getHttpServer()).get(
        `${path}/${simpleRequestData.code}`,
      )

      expect(response.body.code).toEqual(simpleRequestData.code)
      expect(response.body.description).toEqual(simpleRequestData.description)
      expect(response.body.validTo).not.toBeNull()
    })
  })
})
