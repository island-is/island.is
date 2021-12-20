import { setupWithAuth, setupWithoutAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeDTO,
  PersonalRepresentativeCreateDTO,
  PersonalRepresentativeRightType,
  PaginatedPersonalRepresentativeDto,
  PersonalRepresentativeType,
} from '@island.is/auth-api-lib/personal-representative'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.writePersonalRepresentative],
})

const simpleRequestData: PersonalRepresentativeCreateDTO = {
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

describe('PersonalRepresentativeController - Without Auth', () => {
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

  it('POST /v1/personal-representatives should fail and return 403 error if bearer is missing', async () => {
    const response = await server.post(path).send(simpleRequestData).expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })
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
  let prModel: typeof PersonalRepresentative
  let prRightsModel: typeof PersonalRepresentativeRight

  beforeAll(async () => {
    // TestApp setup with auth and database
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
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
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  beforeEach(async () => {
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
      await server.delete(`${path}/${personalRep.id}`).expect(200)
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
      const response = await server
        .get(`${path}?includeInvalid=false&limit=1`)
        .expect(200)

      const responseData: PaginatedPersonalRepresentativeDto = response.body
      expect(responseData.data[0]).toMatchObject(personalRep)
    })
  })

  async function setupBasePersonalRep(
    data: PersonalRepresentativeCreateDTO,
  ): Promise<PersonalRepresentativeDTO> {
    const responseCreate = await server.post(path).send(data)
    return responseCreate.body
  }
})
