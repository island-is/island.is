import { INestApplication } from '@nestjs/common'
import request from 'supertest'
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

describe('bulkCreateEndorsement', () => {
  it(`POST /endorsement-list/:listId/endorsement/bulk should partially succeed when list contains some existing national ids`, async () => {
    const nationalIds = ['0101304339', '0101304339']
    const response = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement/bulk`,
      )
      .send({ nationalIds })
      .expect(201)

    // should return the created endorsements and error objects
    expect(response.body.succeeded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // lets make sure metadata got correctly populated
          meta: {
            ...metaDataResponse,
            bulkEndorsement: true,
          },
        }),
      ]),
    )
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should fail to create endorsements on a closed list`, async () => {
    const nationalIds = ['0101304339']
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c2/endorsement/bulk',
      )
      .send({ nationalIds })
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should fail to create endorsements on other peoples lists`, async () => {
    const nationalIds = ['0101304339']
    const response = await request(app.getHttpServer())
      .post(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c3/endorsement/bulk',
      )
      .send({ nationalIds })
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should create new endorsements and populate metadata`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c1'
    const nationalIds = ['0101303369', '0101305069', '0101303019']
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/${listId}/endorsement/bulk`)
      .send({ nationalIds })
      .expect(201)

    // should return the created endorsements
    expect(response.body.succeeded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          endorsementListId: listId,
          // lets make sure metadata got correctly populated
          meta: {
            ...metaDataResponse,
            bulkEndorsement: true,
          },
        }),
      ]),
    )
  })
})
