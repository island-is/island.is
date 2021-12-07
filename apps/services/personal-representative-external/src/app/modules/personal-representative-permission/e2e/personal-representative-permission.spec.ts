import { setup } from '../../../../../test/setup'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { environment } from '../../../../environments'
import { PersonalRepresentativeDTO } from '@island.is/auth-api-lib/personal-representative'
import { PersonalRepresentativeRightTypeService } from '@island.is/auth-api-lib/personal-representative'
import { PersonalRepresentativeService } from '@island.is/auth-api-lib/personal-representative'

const { externalServiceProvidersApiKeys } = environment

let app: INestApplication
let rightService: PersonalRepresentativeRightTypeService
let prService: PersonalRepresentativeService

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
  app = await setup()
  rightService = app.get<PersonalRepresentativeRightTypeService>(
    PersonalRepresentativeRightTypeService,
  )
  prService = app.get<PersonalRepresentativeService>(
    PersonalRepresentativeService,
  )
})

describe('GET /v1/personal-representative-permission should find personal rep with permissions', () => {
  it('Get v1/personal-representative-permission/{nationalId} should get personal rep connections', async () => {
    // Create right types
    for (const rightType of rightTypeList) {
      await rightService.createAsync({
        code: rightType.code,
        description: rightType.description,
      })
    }

    // Creating personal rep
    const personalRep = await prService.createAsync({
      ...simpleRequestData,
      rightCodes: rightTypeList.map((rt) => rt.code),
    })

    // Test get personal rep
    const response = await request(app.getHttpServer())
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
