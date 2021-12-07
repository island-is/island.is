import { setup } from '../../../../../test/setup'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { environment } from '../../../../environments'
import { PersonalRepresentativeRightTypeService } from '@island.is/auth-api-lib/personal-representative'

const { externalServiceProvidersApiKeys } = environment

let app: INestApplication
let rightService: PersonalRepresentativeRightTypeService

const rightTypeList = [
  { code: 'code1', description: 'code1 description' },
  { code: 'code2', description: 'code2 description' },
]

beforeAll(async () => {
  app = await setup()
  rightService = app.get<PersonalRepresentativeRightTypeService>(
    PersonalRepresentativeRightTypeService,
  )
})

beforeEach(async () => {
  for (const rightType of rightTypeList) {
    await rightService.createAsync({
      code: rightType.code,
      description: rightType.description,
    })
  }
})

describe('GET /v1/permission-type should find personal rep with permissions', () => {
  it('Get v1/permission-type should get all permission types', async () => {
    // Test get personal rep
    const response = await request(app.getHttpServer())
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
    const response = await request(app.getHttpServer())
      .get(`/v1/permission-type/${rightTypeList[0].code}`)
      .set(
        'Authorization',
        `Bearer ${externalServiceProvidersApiKeys.heilsuvera}`,
      )
      .expect(200)

    expect(response.body).toMatchObject(rightTypeList[0])
  })
})
