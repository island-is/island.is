import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { EndorsementTag } from '../../endorsementList.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('findByTagEndorsementList', () => {
  it(`GET /endorsement-list?tag should return validation error when called with a non existing tag`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list?tag=thisTagIsUsedInE2ETests')
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
      message: ['tag must be a valid enum value'],
    })
  })
  it(`GET /endorsement-list?tag should return 200 and empty list when no data exists for given tag`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tag=${EndorsementTag.PARTY_APPLICATION_SUDVESTURKJORDAEMI_2021}`,
      )
      .send()
      .expect(200)

    expect(response.body).toStrictEqual([])
  })
  it(`GET /endorsement-list?tag should return 200 and a list`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tag=${EndorsementTag.PARTY_APPLICATION_SUDURKJORDAEMI_2021}`,
      )
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).toHaveLength(2)
  })
})
