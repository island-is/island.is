import { uuid } from 'uuidv4'
import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import { TestEndpointOptions } from '../../../../../test/types'
import request from 'supertest'
import { getRequestMethod, TestApp } from '@island.is/testing/nest'
import {
  DelegationProviderModel,
  DelegationsIndexService,
  DelegationTypeModel,
  PaginatedPersonalRepresentativeDto,
  PersonalRepresentative,
  PersonalRepresentativeCreateDTO,
  PersonalRepresentativeDelegationTypeModel,
  PersonalRepresentativeDTO,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { addDelegationTypesAndProvider } from '@island.is/services/auth/testing'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.adminPersonalRepresentative],
})

const simpleRequestData: PersonalRepresentativeCreateDTO = {
  personalRepresentativeTypeCode: 'prTypeCode',
  contractId: '1234',
  externalUserId: 'externalUser',
  nationalIdPersonalRepresentative: '1234567890',
  nationalIdRepresentedPerson: '1234567891',
  rightCodes: [],
}

const personalRepresentativeType = {
  code: 'prTypeCode',
  name: 'prTypeName',
  description: 'prTypeDescription',
}

const path = '/v1/personal-representatives'

describe('PersonalRepresentativeController - Without Scope and Auth', () => {
  it.each`
    method      | endpoint
    ${'GET'}    | ${'/v1/personal-representatives'}
    ${'GET'}    | ${'/v1/personal-representatives/1234'}
    ${'POST'}   | ${'/v1/personal-representatives'}
    ${'DELETE'} | ${'/v1/personal-representatives/1234'}
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
    ${'GET'}    | ${'/v1/personal-representatives'}
    ${'GET'}    | ${'/v1/personal-representatives/1234'}
    ${'POST'}   | ${'/v1/personal-representatives'}
    ${'DELETE'} | ${'/v1/personal-representatives/1234'}
  `(
    '$method $endpoint should return 401 when user is unauthorized',
    async ({ method, endpoint }: TestEndpointOptions) => {
      // Arrange
      const app = await setupWithoutAuth()
      const server = request(app.getHttpServer())

      // Act
      const res = await getRequestMethod(server, method)(endpoint)
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

describe('PersonalRepresentativeController', () => {
  const rightTypeList = [
    { code: 'code1', description: 'code1 description' },
    { code: 'code2', description: 'code2 description' },
  ]

  let app: TestApp
  let server: request.SuperTest<request.Test>
  let prRightTypeModel: typeof PersonalRepresentativeRightType
  let prTypeModel: typeof PersonalRepresentativeType
  let prRightsModel: typeof PersonalRepresentativeRight
  let delegationTypeModel: typeof DelegationTypeModel
  let delegationProviderModel: typeof DelegationProviderModel
  let personalRepDelegationType: typeof PersonalRepresentativeDelegationTypeModel
  let prModel: typeof PersonalRepresentative
  let delegationsIndexService: DelegationsIndexService

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    delegationsIndexService = app.get(DelegationsIndexService)
    // Get reference on rightType models to seed DB
    prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
      'PersonalRepresentativeRightTypeRepository',
    )
    prTypeModel = app.get<typeof PersonalRepresentativeType>(
      'PersonalRepresentativeTypeRepository',
    )
    // Get reference on personal representative models to seed DB
    prModel = app.get<typeof PersonalRepresentative>(
      'PersonalRepresentativeRepository',
    )
    // Get reference on personal representative right models to seed DB
    prRightsModel = app.get<typeof PersonalRepresentativeRight>(
      'PersonalRepresentativeRightRepository',
    )
    // Get reference on delegation type model to seed DB
    delegationTypeModel = app.get<typeof DelegationTypeModel>(
      'DelegationTypeModelRepository',
    )
    // Get reference on delegation provider model to seed DB
    delegationProviderModel = app.get<typeof DelegationProviderModel>(
      'DelegationProviderModelRepository',
    )
    // Get reference on personal representative delegation type model to seed DB
    personalRepDelegationType = app.get<
      typeof PersonalRepresentativeDelegationTypeModel
    >('PersonalRepresentativeDelegationTypeModelRepository')

    jest
      .spyOn(delegationsIndexService, 'indexRepresentativeDelegations')
      .mockImplementation()
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    await prRightsModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await prModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await prRightTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await prTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await delegationTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    await delegationProviderModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })

    await addDelegationTypesAndProvider(
      rightTypeList,
      delegationProviderModel,
      delegationTypeModel,
    )
  })

  describe('Create', () => {
    it('POST /v1/personal-representatives should return error when data is invalid', async () => {
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
      expect(
        delegationsIndexService.indexRepresentativeDelegations,
      ).not.toHaveBeenCalled()
    })

    it('POST /v1/personal-representatives should create a new entry', async () => {
      // Create right types
      await prRightTypeModel.bulkCreate(rightTypeList)
      // Create type
      await prTypeModel.create(personalRepresentativeType)

      // Test creating personal rep
      const requestData = {
        ...simpleRequestData,
        rightCodes: rightTypeList.map((rt) => rt.code),
        personalRepresentativeTypeCode: personalRepresentativeType.code,
      }

      const response = await server.post(path).send(requestData).expect(201)

      const result = {
        ...response.body,
        rightCodes: response.body.rights.map(
          (r: PersonalRepresentativeRightType) => r.code,
        ),
      }
      expect(result).toMatchObject(requestData)
      expect(
        delegationsIndexService.indexRepresentativeDelegations,
      ).toHaveBeenCalled()

      // Assert that personal rep is created
      const personalReps = await prModel.findAll({
        where: {
          id: result.id,
        },
      })
      expect(personalReps.length).toBe(1)

      // Assert that personal rep rights are created
      const personalRepRights = await prRightsModel.findAll({
        where: {
          personalRepresentativeId: result.id,
        },
      })
      expect(personalRepRights.length).toBe(2)

      // Assert that personal rep delegation types are created
      const personalRepDelegationTypes =
        await personalRepDelegationType.findAll({
          where: {
            personalRepresentativeId: result.id,
          },
        })
      expect(personalRepDelegationTypes.length).toBe(2)
    })
  })

  describe('Delete', () => {
    it('DELETE /v1/personal-representatives should delete personal rep', async () => {
      // Create right types
      await prRightTypeModel.bulkCreate(rightTypeList)
      // Create type
      await prTypeModel.create(personalRepresentativeType)

      // Creating personal rep
      const personalRep = await setupBasePersonalRep({
        ...simpleRequestData,
        rightCodes: rightTypeList.map((rt) => rt.code),
        personalRepresentativeTypeCode: personalRepresentativeType.code,
      })

      // Test delete personal rep
      await server.delete(`${path}/${personalRep.id}`).expect(204)
      expect(
        delegationsIndexService.indexRepresentativeDelegations,
      ).toHaveBeenCalled()

      // Assert that personal rep is deleted
      const personalReps = await prModel.findAll({
        where: {
          id: personalRep.id,
        },
      })
      expect(personalReps.length).toBe(0)

      // Assert that personal rep rights are deleted
      const personalRepRights = await prRightsModel.findAll({
        where: {
          personalRepresentativeId: personalRep.id,
        },
      })
      expect(personalRepRights.length).toBe(0)

      // Assert that personal rep delegation types are deleted
      const personalRepDelegationTypes =
        await personalRepDelegationType.findAll({
          where: {
            personalRepresentativeId: personalRep.id,
          },
        })
      expect(personalRepDelegationTypes.length).toBe(0)
    })
    it('DELETE /v1/personal-representatives should return success when trying to delete non existing personal rep', async () => {
      // Test delete personal rep
      await server.delete(`${path}/${uuid()}`).expect(204)
    })
    it('DELETE /v1/personal-representatives should return BadRequest for invalid uuid', async () => {
      // Test delete personal rep
      await server.delete(`${path}/notexisting`).expect(400)
      expect(
        delegationsIndexService.indexRepresentativeDelegations,
      ).not.toHaveBeenCalled()
    })
  })

  describe('Get', () => {
    it('Get v1/personal-representatives should get personal reps', async () => {
      // Create right types
      await prRightTypeModel.bulkCreate(rightTypeList)
      // Create type
      await prTypeModel.create(personalRepresentativeType)

      // Creating personal rep
      const personalRep = await setupBasePersonalRep({
        ...simpleRequestData,
        rightCodes: rightTypeList.map((rt) => rt.code),
        personalRepresentativeTypeCode: personalRepresentativeType.code,
      })

      // Test get personal rep
      const response = await server.get(`${path}?&limit=1`).expect(200)

      const responseData: PaginatedPersonalRepresentativeDto = response.body
      expect(responseData.data[0]).toMatchObject({
        ...personalRep,
        prDelegationTypes: expect.arrayContaining(
          responseData.data[0].prDelegationTypes,
        ),
      })
    })
  })

  it('Get v1/personal-representatives should get a specific personal rep connection', async () => {
    // Create right types
    await prRightTypeModel.bulkCreate(rightTypeList)
    // Create type
    await prTypeModel.create(personalRepresentativeType)

    // Creating personal rep
    const personalRep = await setupBasePersonalRep({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
      personalRepresentativeTypeCode: personalRepresentativeType.code,
    })

    // Test get personal rep
    const response = await server.get(`${path}/${personalRep.id}`).expect(200)
    const responseData = response.body as PersonalRepresentativeDTO

    expect(responseData).toMatchObject({
      ...personalRep,
      prDelegationTypes: expect.arrayContaining(responseData.prDelegationTypes),
    })
  })

  it('Get v1/personal-representatives should return notfound for a connection id that does not exist', async () => {
    await server.get(`${path}/${uuid()}`).expect(404)
  })

  it('Get v1/personal-representatives should return badrequest for invalid uuids', async () => {
    await server.get(`${path}/notexisting`).expect(400)
  })

  it('Get v1/personal-representatives should get all connections for a personal rep', async () => {
    // Create right types
    await prRightTypeModel.bulkCreate(rightTypeList)
    // Create type
    await prTypeModel.create(personalRepresentativeType)

    // Creating personal rep
    const personalRep = await setupBasePersonalRep({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
      personalRepresentativeTypeCode: personalRepresentativeType.code,
    })

    // Test get personal rep
    const response = await server
      .get(
        `${path}?&personalRepresentativeId=${simpleRequestData.nationalIdPersonalRepresentative}`,
      )
      .expect(200)

    const responseData: PaginatedPersonalRepresentativeDto = response.body

    expect(responseData.data[0]).toMatchObject({
      ...personalRep,
      prDelegationTypes: expect.arrayContaining(
        responseData.data[0].prDelegationTypes,
      ),
    })
  })

  async function setupBasePersonalRep(
    data: PersonalRepresentativeCreateDTO,
  ): Promise<PersonalRepresentativeDTO> {
    const responseCreate = await server.post(path).send(data)
    return responseCreate.body
  }
})
