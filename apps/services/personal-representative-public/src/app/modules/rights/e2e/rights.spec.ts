import {
  setupWithAuth,
  setupWithoutAuth,
  setupWithoutScope,
} from '../../../../../test/setup'
import request from 'supertest'
import { TestApp } from '@island.is/testing/nest'
import {
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeRightType,
} from '@island.is/auth-api-lib/personal-representative'
import { AuthScope } from '@island.is/auth/scopes'
import { createCurrentUser } from '@island.is/testing/fixtures'

const path = '/v1/rights'

const user = createCurrentUser({
  nationalId: '1122334455',
  scope: [AuthScope.publicPersonalRepresentative],
})

describe('RightsController - Without Auth', () => {
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

  it('Get v1/rights  should fail and return 401 error if bearer is missing', async () => {
    await server.get(path).expect(401)
  })
})

describe('RightsController - Without Scope', () => {
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

  it('Get v1/rights  should fail and return 403 error if bearer is missing the correct scope', async () => {
    await server.get(path).expect(403)
  })
})

describe('RightsController', () => {
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
    it('Get v1/rights should get all permission types', async () => {
      const response = await server.get(path).expect(200)

      const rightTypesResult: {
        code: string
        description: string
      } = response.body.data.map((type: PersonalRepresentativeRightType) => {
        return {
          code: type.code,
          description: type.description,
        }
      })

      expect(rightTypesResult).toMatchObject(rightTypeList)
    })

    it('Get v1/rights should get permission type by code', async () => {
      const response = await server
        .get(`${path}/${rightTypeList[0].code}`)
        .expect(200)

      expect(response.body).toMatchObject(rightTypeList[0])
    })

    it('Get v1/rights should get NotFound result for non existing code', async () => {
      await server.get(`${path}/noexistingcode`).expect(404)
    })
  })
})
