import { deserialize } from './../../../../../../../../libs/contentful-extensions/translation/src/utils/deserialize'
import { setupWithAuth, setupWithoutAuth } from '../../../../../test/setup'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import {
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeRightType,
} from '@island.is/auth-api-lib/personal-representative'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.readPersonalRepresentative],
})

describe('RightTypesTypeController - Without Auth', () => {
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

  it('Get v1/right-types  should fail and return 403 error if bearer is missing', async () => {
    await server.get(`/v1/right-types`).expect(403)
  })
})

describe('RightTypesTypeController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let rightService: PersonalRepresentativeRightTypeService
  let prRightTypeModel: typeof PersonalRepresentativeRightType

  const rightTypeList = [
    { code: 'code1', description: 'code1 description' },
    { code: 'code2', description: 'code2 description' },
  ]

  beforeAll(async () => {
    app = await setupWithAuth({ user })
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
      await rightService.create({
        code: rightType.code,
        description: rightType.description,
      })
    }
  })

  describe('Get', () => {
    it('Get v1/right-types should get all permission types', async () => {
      // Test get personal rep
      const response = await server.get(`/v1/right-types`).expect(200)

      const rightTypesResult: {
        code: string
        description: string
      } = response.body.data.map((type: PersonalRepresentativeRightType) => {
        return {
          code: type.code,
          description: type.description,
        }
      })
      console.log(rightTypesResult)
      console.log(rightTypeList)

      expect(rightTypesResult).toMatchObject(rightTypeList)
    })

    it('Get v1/right-types should get permission type by code', async () => {
      // Test get personal rep
      const response = await server
        .get(`/v1/right-types/${rightTypeList[0].code}`)
        .expect(200)

      expect(response.body).toMatchObject(rightTypeList[0])
    })
  })
})
