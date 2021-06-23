import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('FindByOwnerPartyLetterRegistry', () => {
  it('GET /party-letter-registry/owner should return error when national id is invalid', async () => {
    const nationalId = '0000000001'
    const response = await request(app.getHttpServer())
      .get(`/party-letter-registry/owner?owner=${nationalId}`)
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it('GET /party-letter-registry/owner should return not found error when national owns no letters', async () => {
    const nationalId = '0101302209'
    const response = await request(app.getHttpServer())
      .get(`/party-letter-registry/owner?owner=${nationalId}`)
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it('GET /party-letter-registry/owner should return a party letter entry', async () => {
    const nationalId = '0101302989'
    const response = await request(app.getHttpServer())
      .get(`/party-letter-registry/owner?owner=${nationalId}`)
      .send()
      .expect(200)

    expect(response.body).toMatchObject({
      owner: nationalId,
    })
  })
})
