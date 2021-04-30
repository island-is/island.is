import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Endorsement } from '../endorsement.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.anyOf([String, Array]),
  statusCode: expect.any(Number),
}

const metaDataResponse = {
  fullName: expect.any(String),
  address: {
    streetAddress: expect.any(String),
    city: expect.any(String),
    postalCode: expect.any(String),
  },
  bulkEndorsement: expect.any(Boolean),
  invalidated: expect.any(Boolean),
}

describe('Endorsement', () => {
  it(`GET /endorsement-list/:listId/endorsement should return 404 and error if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement')
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement should return 200 and a list of endorsements`, async () => {
    const response: { body: Endorsement[] } = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement')
      .send()
      .expect(200)

    for (const endorsementResponse of response.body) {
      const endorsement = new Endorsement(endorsementResponse) // we know we have at least one endorsement
      await expect(endorsement.validate()).resolves.not.toThrow()
    }
  })

  it(`GET /endorsement-list/:listId/endorsement/exists should return 404 and error if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement/exists',
      )
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement/exists should return 200 and a valid endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .get(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement/exists',
      )
      .send()
      .expect(200)

    const endorsement = new Endorsement(response.body) // we know we have at least one endorsement
    await expect(endorsement.validate()).resolves.not.toThrow()
  })

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
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c3/endorsement',
      )
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  // TODO: Add test for unique within tags endorsements here when auth is added
  it(`POST /endorsement-list/:listId/endorsement should create a new endorsement and populate metadata`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c1'
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
    const nationalId = '0101302209'
    const bulkResponse = await request(app.getHttpServer())
      .post(
        `/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c4/endorsement/bulk`,
      )
      .send({ nationalIds: [nationalId] })
      .expect(201)

    // should return the bulk created endorsement as invalidated
    expect(bulkResponse.body).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          // lets make sure endorsement got invalidated
          meta: {
            ...metaDataResponse,
            invalidated: true,
          },
        }),
      ]),
    )

    // TODO: Add test to make sure other endorsement is invalidated as well when auth is added
  })
  it(`POST /endorsement-list/:listId/endorsement/bulk should create a new endorsements and populate metadata`, async () => {
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

  it(`DELETE /endorsement-list/:listId/endorsement should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement',
      )
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`DELETE /endorsement-list/:listId/endorsement should fail when removing endorsement from closed list`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c3/endorsement',
      )
      .send()
      .expect(405)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 405,
    })
  })
  it(`DELETE /endorsement-list/:listId/endorsement should remove endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement',
      )
      .send()
      .expect(204)

    expect(response.body).toBeTruthy()
  })
})
