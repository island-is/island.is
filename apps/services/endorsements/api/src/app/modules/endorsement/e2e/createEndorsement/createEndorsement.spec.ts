import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { setup } from '../../../../../../test/setup'
import {
  errorExpectedStructure,
  metaDataResponse,
} from '../../../../../../test/testHelpers'
import { authNationalId } from './seed'
let app: INestApplication

beforeAll(async () => {
  app = await setup({
    override: (builder) => {
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(new MockAuthGuard({ nationalId: authNationalId }))
        .compile()
    },
  })
})

describe('createEndorsement', () => {
  it(`POST /endorsement-list/:listId/endorsement should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement',
      )
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should fail to create endorsement on a closed list`, async () => {
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c4/endorsement',
      )
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should fail to create endorsement when conflicts within tags`, async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c5/endorsement`,
      )
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement should create a new endorsement and populate metadata`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba011'
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/${listId}/endorsement`)
      .send()
      .expect(201)

    // should return the created object
    expect(response.body).toMatchObject({
      endorsementListId: listId,
      // lets make sure metadata got populated
      meta: metaDataResponse,
    })
  })
})
