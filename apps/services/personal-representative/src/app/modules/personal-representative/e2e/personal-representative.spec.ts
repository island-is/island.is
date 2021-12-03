import { setup } from '../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../test/testHelpers'
import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { environment } from '../../../../environments'
import * as faker from 'faker'
import { PersonalRepresentativeRightTypeService } from '@island.is/auth-api-lib/personal-representative'

const { childServiceApiKeys } = environment

let app: INestApplication

const simpleRequestData = {
  nationalIdPersonalRepresentative: '1234567890',
  nationalIdRepresentedPerson: '1234567891',
  validTo: '2021-12-03T12:37:07.676Z',
  rightCodes: ['health', 'finances'],
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
    await request(app.getHttpServer())
      .post('/v1/right-types')
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .send({ code: 'health', description: 'descr health' })
    await request(app.getHttpServer())
      .post('/v1/right-types')
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .send({ code: 'finances', description: 'descr finances' })

    console.group('Post success')
    console.log(simpleRequestData)
    const response = await request(app.getHttpServer())
      .post('/v1/personal-representative')
      .send(simpleRequestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
    console.log(response)
    console.groupEnd()
    expect(response.body).toMatchObject(simpleRequestData)
  })
})
/*
describe('Update Right Type', () => {
  it('Put /right-types should fail and return 403 error if bearer is missing', async () => {
    await request(app.getHttpServer())
      .post('/right-types')
      .send(simpleRequestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )

    const requestData = {
      ...simpleRequestData,
      description: 'DescriptionUpdated',
    }

    const response = await request(app.getHttpServer())
      .put(`/right-types/${requestData.code}`)
      .send(requestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .expect(200)

    expect(response.body).toMatchObject(requestData)
  })
})

describe('Get Right Type/s', () => {
  it('Get /right-types should fail and return 403 error if bearer is missing', async () => {
    await request(app.getHttpServer())
      .post('/right-types')
      .send(simpleRequestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )

    const response = await request(app.getHttpServer())
      .get(`/right-types/${simpleRequestData.code}`)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .expect(200)

    expect(response.body.code).toMatch(simpleRequestData.code)
    expect(response.body.description).toMatch(simpleRequestData.description)
  })
})

describe('Delete/Remove Right Type', () => {
  it('Delete /right-types should fail and return 403 error if bearer is missing', async () => {
    await request(app.getHttpServer())
      .post('/right-types')
      .send(simpleRequestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
    const requestData = {
      ...simpleRequestData,
      description: 'DescriptionUpdated',
    }

    await request(app.getHttpServer())
      .delete(`/right-types/${requestData.code}`)
      .send(requestData)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )
      .expect(200)

    const response = await request(app.getHttpServer())
      .get(`/right-types/${simpleRequestData.code}`)
      .set(
        'Authorization',
        `Bearer ${childServiceApiKeys.felagsmalaraduneytid}`,
      )

    expect(response.body.code).toMatch(simpleRequestData.code)
    expect(response.body.description).toMatch(simpleRequestData.description)
    expect(response.body.validTo).not.toBeNull()
  })
})
*/
