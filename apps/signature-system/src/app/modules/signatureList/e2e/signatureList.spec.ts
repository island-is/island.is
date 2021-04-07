import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { SignatureList } from '../signatureList.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.any(Array),
  statusCode: expect.any(Number),
}

describe('SignatureList', () => {
  it(`GET /signature-list?tag should return validation error when called with a non existing tag`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list?tag=thisTagIsUsedInE2ETests')
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
      message: ['tag must be a valid enum value'],
    })
  })
  it(`GET /signature-list?tag should return 200 and empty list when no data exists for given tag`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list?tag=reykjavikurkjordaemiSudur')
      .send()
      .expect(200)

    expect(response.body).toStrictEqual([])
  })
  it(`GET /signature-list?tag should return 200 and list`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list?tag=nordausturkjordaemi')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).toHaveLength(2)
  })

  it(`GET /signature-list/:uid should return 404 error when uid does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list/9c0b4106-4213-43be-a6b2-ff324f4ba777') // random uuid
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /signature-list/:uid should return 200 and a valid signature list`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1')
      .send()
      .expect(200)

    const signatureList = new SignatureList({ ...response.body })
    await expect(signatureList.validate()).resolves.not.toThrow()
  })

  it(`GET /signature-list/:uid/signatures should return 200 and a list of signatures`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1/signatures')
      .send()
      .expect(200)

    expect(Array.isArray(response.body.signatures)).toBeTruthy()
    expect(response.body.signatures.length > 0).toBeTruthy()
  })
  it(`GET /signature-list/:uid/signatures should return 404 error when uid does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/signature-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/signatures')
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })

  it(`PUT /signature-list/:uid/close should return 404 when closing an non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .put('/signature-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/close')
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`PUT /signature-list/:uid/close should close existing signature list`, async () => {
    const response = await request(app.getHttpServer())
      .put('/signature-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c2/close')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({ closedDate: expect.any(String) })
  })

  it(`POST /signature-list should create new signature list`, async () => {
    const newSignatureList = {
      title: 'Some title',
      description: 'Some description',
      tags: ['nordausturkjordaemi'],
      signatureMeta: ['fullName'],
      validationRules: [
        {
          type: 'minAgeAtDate',
          value: '2021-03-15:18',
        },
      ],
    }
    const response = await request(app.getHttpServer())
      .post('/signature-list')
      .send(newSignatureList)
      .expect(201)

    expect(response.body).toMatchObject(newSignatureList) // should return the created object
  })
  it(`POST /signature-list should return error when data is invalid`, async () => {
    const newSignatureList = {
      title: 123, // invalid
      description: 'Some description',
      tags: ['nordausturkjordaemi'],
      signatureMeta: ['fullName'],
      validationRules: [
        {
          type: 'minAgeAtDate',
          value: '2021-03-15:18',
        },
      ],
    }
    const response = await request(app.getHttpServer())
      .post('/signature-list')
      .send(newSignatureList)
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
})
