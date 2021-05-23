import { setup } from '../../../../../../test/setup'
import {
  emptyResponseExpectedStructure,
  errorExpectedStructure,
} from '../../../../../../test/testHelpers'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('FindOneVoterRegistry', () => {
  it('GET /voter-registry should return error when national id is invalid', async () => {
    const nationalId = '0000000001'
    const response = await request(app.getHttpServer())
      .get(`/voter-registry?nationalId=${nationalId}`)
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it('GET /voter-registry should return not on record response when trying to fetch older version', async () => {
    const nationalId = '0101303019'
    const response = await request(app.getHttpServer())
      .get(`/voter-registry?nationalId=${nationalId}`)
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      ...emptyResponseExpectedStructure,
      nationalId,
    })
  })
  it('GET /voter-registry should return entry from current version', async () => {
    const nationalId = '0101302989'
    const response = await request(app.getHttpServer())
      .get(`/voter-registry?nationalId=${nationalId}`)
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      nationalId,
      version: 3,
    })
  })
})
