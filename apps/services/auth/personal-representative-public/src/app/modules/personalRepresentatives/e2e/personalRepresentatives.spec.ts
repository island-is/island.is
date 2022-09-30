import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../../test/setup'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import {
  PersonalRepresentative,
  PersonalRepresentativePublicDTO,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeType,
  PersonalRepresentativeCreateDTO,
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const path = '/v1/personal-representatives'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.publicPersonalRepresentative],
})

const rightTypeList = [
  { code: 'code1', description: 'code1 description' },
  { code: 'code2', description: 'code2 description' },
]

const personalRepresentativeType = {
  code: 'prTypeCode',
  name: 'prTypeName',
  description: 'prTypeDescription',
}

const simpleRequestData: PersonalRepresentativeCreateDTO = {
  contractId: '123456',
  personalRepresentativeTypeCode: 'prTypeCode',
  nationalIdPersonalRepresentative: '1234567890',
  nationalIdRepresentedPerson: '1234567891',
  externalUserId: 'adUserFromContractSystem',
  rightCodes: [],
}

describe('PersonalRepresentativesController - Without Auth', () => {
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

  it('Get v1/personal-representatives/{nationalId} should fail and return 401 error if bearer is missing', async () => {
    // Test get personal rep
    await server
      .get(`${path}?prId=${simpleRequestData.nationalIdPersonalRepresentative}`)
      .expect(401)
  })
})

describe('PersonalRepresentativesController - Without Scope', () => {
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

  it('Get v1/personal-representatives/{nationalId} should fail and return 403 error if bearer is missing the correct scope', async () => {
    // Test get personal rep
    await server
      .get(`${path}?prId=${simpleRequestData.nationalIdPersonalRepresentative}`)
      .expect(403)
  })
})

describe('PersonalRepresentativesController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let rightService: PersonalRepresentativeRightTypeService
  let prService: PersonalRepresentativeService
  let prTypeModel: typeof PersonalRepresentativeType
  let prRightTypeModel: typeof PersonalRepresentativeRightType
  let prModel: typeof PersonalRepresentative
  let prPermissionsModel: typeof PersonalRepresentativeRight

  beforeAll(async () => {
    app = await setupWithAuth({ user })
    server = request(app.getHttpServer())
    rightService = app.get<PersonalRepresentativeRightTypeService>(
      PersonalRepresentativeRightTypeService,
    )
    prService = app.get<PersonalRepresentativeService>(
      PersonalRepresentativeService,
    )
    // Get reference on rightType models to seed DB
    prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
      'PersonalRepresentativeRightTypeRepository',
    )
    // Get reference on rightType models to seed DB
    prTypeModel = app.get<typeof PersonalRepresentativeType>(
      'PersonalRepresentativeTypeRepository',
    )
    // Get reference on personal representative models to seed DB
    prModel = app.get<typeof PersonalRepresentative>(
      'PersonalRepresentativeRepository',
    )
    // Get reference on personal representative right models to seed DB
    prPermissionsModel = app.get<typeof PersonalRepresentativeRight>(
      'PersonalRepresentativeRightRepository',
    )
  })

  beforeEach(async () => {
    await prPermissionsModel.destroy({
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
    await prTypeModel.destroy({
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
    // Create personal representastive type
    await prTypeModel.create(personalRepresentativeType)
    // Create right types
    for (const rightType of rightTypeList) {
      await rightService.create({
        code: rightType.code,
        description: rightType.description,
      })
    }
    await prModel.create({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
      personalRepresentativeTypeCode: personalRepresentativeType.code,
    })

    // Creating personal rep
    await prService.create({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
      personalRepresentativeTypeCode: personalRepresentativeType.code,
    })
    //personalRepPublic.rights = rightTypeList.map((rt) => rt.code)
  })

  describe('Get', () => {
    it('Get v1/personal-representatives?prId={nationalId} should get personal rep connections', async () => {
      const personalRepPublic = {
        personalRepresentativeTypeCode:
          simpleRequestData.personalRepresentativeTypeCode,
        nationalIdPersonalRepresentative:
          simpleRequestData.nationalIdPersonalRepresentative,
        nationalIdRepresentedPerson:
          simpleRequestData.nationalIdRepresentedPerson,
        rights: rightTypeList.map((rt) => rt.code),
      }
      // Test get personal rep
      const response = await server
        .get(
          `${path}?prId=${simpleRequestData.nationalIdPersonalRepresentative}`,
        )
        .expect(200)

      const responseData: PersonalRepresentativePublicDTO[] = response.body
      expect(responseData).toMatchObject([personalRepPublic])
    })

    it('Get v1/personal-representatives?prId={nationalId} with unknown should get an empty list back', async () => {
      // Test get personal rep
      const response = await server.get(`${path}?prId=1111112222`).expect(200)
      const responseData: PersonalRepresentativePublicDTO[] = response.body
      expect(responseData.length).toEqual(0)
    })

    it('Get v1/personal-representatives should fail with 400 if prId is missing', async () => {
      // Test get personal rep
      await server.get(path).expect(400)
    })
  })
})
