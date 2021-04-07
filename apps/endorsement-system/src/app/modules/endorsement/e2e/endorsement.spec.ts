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
  message: expect.any(Array),
  statusCode: expect.any(Number),
}

describe('Endorsement', () => {
  it(`GET /endorsement?listId=uid should return 200 and empty list if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement?listId=9c0b4106-4213-43be-a6b2-ff324f4ba777')
      .send()
      .expect(200)

    await expect(response.body).toStrictEqual([])
  })
  it(`GET /endorsement should return 200 and all users endorsements`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length > 0).toBeTruthy() // we know we have at least 1 endorsement
  })
  it(`GET /endorsement?listId=uid should return 200 and a valid endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement?listId=9c0b4106-4213-43be-a6b2-ff324f4ba0c1')
      .send()
      .expect(200)

    const endorsement = new Endorsement(response.body[0]) // we know we have at least one endorsement
    await expect(endorsement.validate()).resolves.not.toThrow()
  })

  it(`POST /endorsement should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .post('/endorsement')
      .send({ listId: '9c0b4106-4213-43be-a6b2-ff324f4ba777' })
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`POST /endorsement should create a new endorsement`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c3'
    const response = await request(app.getHttpServer())
      .post('/endorsement')
      .send({ listId })
      .expect(201)

    // should return the created object
    expect(response.body).toMatchObject({
      endorsementListId: listId,
    })
  })

  it(`DELETE /endorsement/:uid should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .delete('/endorsement')
      .send({ listId: '9c0b4106-4213-43be-a6b2-ff324f4ba777' })
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`DELETE /endorsement/:uid should remove endorsement`, async () => {
    const response = await request(app.getHttpServer())
      .delete('/endorsement')
      .send({ listId: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2' })
      .expect(200)

    expect(response.body).toBeTruthy()
  })
})
