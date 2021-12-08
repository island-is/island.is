import { setupWithoutAuth } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { environment } from '../../../../environments'
import {
  PersonalRepresentative,
  PersonalRepresentativeDTO,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
} from '@island.is/auth-api-lib/personal-representative'
import { PersonalRepresentativeRightTypeService } from '@island.is/auth-api-lib/personal-representative'
import { PersonalRepresentativeService } from '@island.is/auth-api-lib/personal-representative'

describe('PersonalRepresentativePermissionController', () => {
  const { externalServiceProvidersApiKeys } = environment

  let app: TestApp
  let server: request.SuperTest<request.Test>
  let rightService: PersonalRepresentativeRightTypeService
  let prService: PersonalRepresentativeService
  let prRightTypeModel: typeof PersonalRepresentativeRightType
  let prModel: typeof PersonalRepresentative
  let prPermissionsModel: typeof PersonalRepresentativeRight
  let personalRep: PersonalRepresentativeDTO | null

  const rightTypeList = [
    { code: 'code1', description: 'code1 description' },
    { code: 'code2', description: 'code2 description' },
  ]

  const simpleRequestData: PersonalRepresentativeDTO = {
    nationalIdPersonalRepresentative: '1234567890',
    nationalIdRepresentedPerson: '1234567891',
    rightCodes: [],
  }

  beforeAll(async () => {
    app = await setupWithoutAuth()
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
    await prRightTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    // Create right types
    for (const rightType of rightTypeList) {
      await rightService.createAsync({
        code: rightType.code,
        description: rightType.description,
      })
    }
    // Creating personal rep
    personalRep = await prService.createAsync({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
    })
  })

  describe('Get', () => {
    it('Get v1/personal-representative-permission/{nationalId} should fail and return 403 error if bearer is missing', async () => {
      // Test get personal rep
      const response = await server
        .get(
          `/v1/personal-representative-permission/${simpleRequestData.nationalIdPersonalRepresentative}/`,
        )
        .expect(403)

      expect(response.body).toMatchObject({
        ...errorExpectedStructure,
        statusCode: 403,
      })
    })

    it('Get v1/personal-representative-permission/{nationalId} should get personal rep connections', async () => {
      // Test get personal rep
      const response = await server
        .get(
          `/v1/personal-representative-permission/${simpleRequestData.nationalIdPersonalRepresentative}/`,
        )
        .set(
          'Authorization',
          `Bearer ${externalServiceProvidersApiKeys.heilsuvera}`,
        )
        .expect(200)

      const responseData: PersonalRepresentativeDTO[] = response.body
      if (personalRep) {
        expect(responseData[0]).toMatchObject(personalRep)
      } else {
        expect('Failed to create personal rep').toMatch('0')
      }
    })
  })
})
