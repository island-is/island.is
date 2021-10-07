import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { setup } from '../../../../../../test/setup'
import { errorExpectedStructure } from '../../../../../../test/testHelpers'
import { EndorsementTag } from '../../constants'

let app: INestApplication
// this is a unauthenticated app
beforeAll(async () => {
  app = await setup()
})

describe('findByTagsEndorsementList', () => {
  it(`GET /endorsement-list?tags should return validation error when called with a non existing tag`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tags[]=thisTagIsUsedInE2ETests&tags[]=${EndorsementTag.GENERAL_PETITION}`,
      )
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
      message: ['each value in tags must be a valid enum value'],
    })
  })
  it(`GET /endorsement-list?tags should return 200 and empty list when no data exists for given tags`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tags=${EndorsementTag.PARTY_LETTER_2021}`,
      )
      .send()
      .expect(200)

    expect(response.body).toStrictEqual([])
  })
  it(`GET /endorsement-list?tags should return 200 and a list`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tags=${EndorsementTag.GENERAL_PETITION}`,
      )
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).toHaveLength(2)
  })
})
