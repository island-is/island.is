import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Signature } from '../signature.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.any(Array),
  statusCode: expect.any(Number),
}

describe('Signature', () => {
  it(`GET /signature?listId=uid should return 200 and empty list if list does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature?listId=9c0b4106-4213-43be-a6b2-ff324f4ba777')
      .send()
      .expect(200)

    await expect(response.body).toStrictEqual([])
  })
  it(`GET /signature should return 200 and all users signatures`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length > 0).toBeTruthy() // we know we have at least 1 signature
  })
  it(`GET /signature?listId=uid should return 200 and a valid signature`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature?listId=9c0b4106-4213-43be-a6b2-ff324f4ba0c1')
      .send()
      .expect(200)

    const signature = new Signature(response.body[0]) // we know we have at least one signature
    await expect(signature.validate()).resolves.not.toThrow()
  })

  it(`POST /signature should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .post('/signature')
      .send({ listId: '9c0b4106-4213-43be-a6b2-ff324f4ba777' })
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`POST /signature should create a new signature`, async () => {
    const listId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c3'
    const response = await request(app.getHttpServer())
      .post('/signature')
      .send({ listId })
      .expect(201)

    // should return the created object
    expect(response.body).toMatchObject({
      signatureListId: listId,
    })
  })

  it(`DELETE /signature/:uid should return 404 when supplied with a non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .delete('/signature')
      .send({ listId: '9c0b4106-4213-43be-a6b2-ff324f4ba777' })
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`DELETE /signature/:uid should remove signature`, async () => {
    const response = await request(app.getHttpServer())
      .delete('/signature')
      .send({ listId: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2' })
      .expect(200)

    expect(response.body).toBeTruthy()
  })
})
