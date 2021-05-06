import { setup } from '../../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import {
  errorExpectedStructure,
  metaDataResponse,
} from '../../../../utils/testHelpers'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
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
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          // lets make sure metadata got correctly populated
          meta: {
            ...metaDataResponse,
            bulkEndorsement: true,
            invalidated: false,
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
  it(`POST /endorsement-list/:listId/endorsement/bulk should create a new endorsement and invalidate all endorsements`, async () => {
    const bulkResponse = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement/bulk`,
      )
      .send({ nationalIds: [authNationalId] })
      .expect(201)

    const singleResponse = await request(app.getHttpServer())
      .get(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c3/endorsement/exists`,
      )
      .send()
      .expect(200)

    // should return the bulk created endorsement as invalidated
    expect(bulkResponse.body).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          // lets make sure created endorsement got invalidated
          meta: expect.objectContaining({
            invalidated: true,
          }),
        }),
      ]),
    )

    // should have invalidated other endorsement
    expect(singleResponse.body).toMatchObject(
      expect.objectContaining({
        // lets make sure existing endorsement got invalidated
        meta: expect.objectContaining({
          invalidated: true,
        }),
      }),
    )
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should create new endorsements and populate metadata`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c1'
    const nationalIds = ['0101303369', '0101305069', '0101303019']
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/${listId}/endorsement/bulk`)
      .send({ nationalIds })
      .expect(201)

    // should return the created endorsements
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          endorsementListId: listId,
          // lets make sure metadata got correctly populated
          meta: {
            ...metaDataResponse,
            bulkEndorsement: true,
            invalidated: false,
          },
        }),
      ]),
    )
  })
})
