import { setup } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { environment } from '../../../../environments'
import {
  PersonalRepresentativeDTO,
  PersonalRepresentativeRightType,
} from '@island.is/auth-api-lib/personal-representative'

const { childServiceApiKeys } = environment

let app: INestApplication

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
})

describe('Create Right Type', () => {
  it('POST /v1/personal-representative should fail and return 403 error if bearer is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/personal-representative')
      .send(simpleRequestData)
      .expect(403)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 403,
    })
  })

  it('POST /v1/personal-representative should return error when data is invalid', async () => {
    const requestData = {
      code: 'Code',
      description: 'Description',
      validFrom: '10-11-2021',
    }
    const response = await request(app.getHttpServer())
      .post('/v1/personal-representative')
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .send(requestData)
      .expect(400)
    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })

  it('POST /v1/personal-representative should create a new entry', async () => {
    // Create right types
    const rightTypes = await setupRights()

    // Test creating personal rep
    const requestData = {
      ...simpleRequestData,
      rightCodes: rightTypes.map((rt) => rt.code),
    }

    const response = await request(app.getHttpServer())
      .post('/v1/personal-representative')
      .send(requestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .expect(201)

    expect(response.body).toMatchObject(requestData)
  })
})

describe('DELETE /v1/personal-representative should delete personal rep', () => {
  it('DELETE /v1/personal-representative should delete personal rep', async () => {
    // Create right types
    const rightTypes = await setupRights()

    // Creating personal rep
    const personalRep = await setupBasePersonalRep({
      ...simpleRequestData,
      rightCodes: rightTypes.map((rt) => rt.code),
    })

    // Test delete personal rep
    await request(app.getHttpServer())
      .delete(`/v1/personal-representative/${personalRep.id}`)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .expect(200)
  })
})

describe('GET /v1/personal-representative should find personal reps', () => {
  it('Get v1/personal-representative/all should get personal rep', async () => {
    // Create right types
    const rightTypes = await setupRights()

    // Creating personal rep
    const personalRep = await setupBasePersonalRep({
      ...simpleRequestData,
      rightCodes: rightTypes.map((rt) => rt.code),
    })

    // Test get personal rep
    const response = await request(app.getHttpServer())
      .get(`/v1/personal-representative/all/`)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .expect(200)

    const responseData: PersonalRepresentativeDTO[] = response.body
    expect(responseData[0]).toMatchObject(personalRep)
  })
})

async function setupRights(): Promise<PersonalRepresentativeRightType[]> {
  // Create right types
  const rightTypes: PersonalRepresentativeRightType[] = []
  for (const rightType of rightTypeList) {
    const resp = await request(app.getHttpServer())
      .post('/v1/right-types')
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .send({ code: rightType.code, description: rightType.description })
    rightTypes.push(resp.body)
  }
  return rightTypes
}

async function setupBasePersonalRep(
  data: PersonalRepresentativeDTO,
): Promise<PersonalRepresentativeDTO> {
  const responseCreate = await request(app.getHttpServer())
    .post('/v1/personal-representative')
    .set('Authorization', `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`)
    .send(data)
  return responseCreate.body
}
