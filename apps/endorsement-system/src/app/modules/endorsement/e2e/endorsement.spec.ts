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

describe('Endorsement', () => {
  it(`GET /endorsement-list/:listId/endorsement should return 404 and error list if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/endorsement')
      .send()
      .expect(404)

    await expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId/endorsement should return 200 and a valid endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/endorsement')
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
  // TODO: Add test for unique within tags endorsements here
  it(`POST /endorsement-list/:listId/endorsement should create a new endorsement and populate metadata`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c3'
    const response = await request(app.getHttpServer())
      .post(`/endorsement-list/${listId}/endorsement`)
      .send()
      .expect(201)

    // should return the created object
    expect(response.body).toMatchObject({
      endorsementListId: listId,
      // lets make sure metadata got populated
      meta: {
        fullName: expect.any(String),
        address: {
          streetAddress: expect.any(String),
          city: expect.any(String),
          postalCode: expect.any(String),
        },
      },
    })
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
  it(`DELETE /endorsement-list/:listId/endorsement should remove endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .delete(
        '/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c2/endorsement',
      )
      .send()
      .expect(204)

    expect(response.body).toBeTruthy()
  })
})
