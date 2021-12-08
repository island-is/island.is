import { setupWithoutAuth } from '../../../../../test/setup'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import { environment } from '../../../../environments'
import {
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeRightType,
} from '@island.is/auth-api-lib/personal-representative'

describe('PermissionTypeController', () => {
  const { externalServiceProvidersApiKeys } = environment

  let app: TestApp
  let server: request.SuperTest<request.Test>
  let rightService: PersonalRepresentativeRightTypeService
  let prRightTypeModel: typeof PersonalRepresentativeRightType

  const rightTypeList = [
    { code: 'code1', description: 'code1 description' },
    { code: 'code2', description: 'code2 description' },
  ]

  beforeAll(async () => {
    app = await setupWithoutAuth()
    server = request(app.getHttpServer())
    rightService = app.get<PersonalRepresentativeRightTypeService>(
      PersonalRepresentativeRightTypeService,
    )
    // Get reference on rightType models to seed DB
    prRightTypeModel = app.get<typeof PersonalRepresentativeRightType>(
      'PersonalRepresentativeRightTypeRepository',
    )
  })

  beforeEach(async () => {
    await prRightTypeModel.destroy({
      where: {},
      cascade: true,
      truncate: true,
      force: true,
    })
    for (const rightType of rightTypeList) {
      await rightService.createAsync({
        code: rightType.code,
        description: rightType.description,
      })
    }
  })

  describe('Get', () => {
    it('Get v1/permission-type should get all permission types', async () => {
      // Test get personal rep
      const response = await server
        .get(`/v1/permission-type`)
        .set(
          'Authorization',
          `Bearer ${externalServiceProvidersApiKeys.heilsuvera}`,
        )
        .expect(200)

      expect(response.body).toMatchObject(rightTypeList)
    })

    it('Get v1/permission-type should get permission type by code', async () => {
      // Test get personal rep
      const response = await server
        .get(`/v1/permission-type/${rightTypeList[0].code}`)
        .set(
          'Authorization',
          `Bearer ${externalServiceProvidersApiKeys.heilsuvera}`,
        )
        .expect(200)

      expect(response.body).toMatchObject(rightTypeList[0])
    })
  })
})
