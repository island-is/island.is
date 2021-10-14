import { INestApplication } from '@nestjs/common'
import { Console } from 'console'
import request from 'supertest'
import { ConsoleTransportOptions } from 'winston/lib/winston/transports'
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
        `/endorsement-list?tags[]=thisTagIsUsedInE2ETests&tags[]=${EndorsementTag.PARTY_APPLICATION_SUDVESTURKJORDAEMI_2021}`,
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
        `/endorsement-list?tags=${EndorsementTag.PARTY_APPLICATION_SUDVESTURKJORDAEMI_2021}`,
      )
      .send()
      .expect(200)
    expect(response.body.data).toStrictEqual([])
  })
  it(`GET /endorsement-list?tags should return 200 and a list`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        `/endorsement-list?tags=${EndorsementTag.PARTY_APPLICATION_SUDURKJORDAEMI_2021}`,
      )
      .send()
      .expect(200)
    expect(Array.isArray(response.body.data)).toBeTruthy()
    expect(response.body.data).toHaveLength(2)
    expect(response.body.totalCount).toEqual(2)
  })

  // general petition tests
  it(`GET /endorsement-list/general-petition-lists should return 200 and 2 lists`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/endorsement-list/general-petition-lists?limit=5`)
      .send()
      .expect(200)
    expect(response.body.data).toHaveLength(5)
    expect(response.body.pageInfo.hasNextPage).toBeTruthy()
    expect(response.body.pageInfo.hasPreviousPage).toBeFalsy()
  })
})
