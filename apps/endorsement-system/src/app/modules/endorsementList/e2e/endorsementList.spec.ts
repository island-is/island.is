import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { EndorsementList } from '../endorsementList.model'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

const errorExpectedStructure = {
  error: expect.any(String),
  message: expect.anyOf([String, Array]),
  statusCode: expect.any(Number),
}

describe('EndorsementList', () => {
  it(`GET /endorsement-list?tag should return validation error when called with a non existing tag`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list?tag=thisTagIsUsedInE2ETests')
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
      message: ['tag must be a valid enum value'],
    })
  })
  it(`GET /endorsement-list?tag should return 200 and empty list when no data exists for given tag`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list?tag=reykjavikurkjordaemiSudur')
      .send()
      .expect(200)

    expect(response.body).toStrictEqual([])
  })
  it(`GET /endorsement-list?tag should return 200 and list`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list?tag=nordausturkjordaemi')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body).toHaveLength(2)
  })

  it(`GET /endorsement-list/:listId should return 404 error when uid does not exist`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777') // random uuid
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`GET /endorsement-list/:listId should return 400 validation error when listId is not UUID`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/notAUUID')
      .send()
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
  it(`GET /endorsement-list/:listId should return 200 and a valid endorsement list`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c1')
      .send()
      .expect(200)

    const endorsementList = new EndorsementList({ ...response.body })
    await expect(endorsementList.validate()).resolves.not.toThrow()
  })

  // TODO: Test failure case here when auth is implemented
  it(`GET /endorsement-list/endorsements should return 200 and a list of endorsements`, async () => {
    const response = await request(app.getHttpServer())
      .get('/endorsement-list/endorsements')
      .send()
      .expect(200)

    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length > 0).toBeTruthy()
  })

  it(`PUT /endorsement-list/:listId/close should return 404 when closing an non existing list`, async () => {
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba777/close')
      .send()
      .expect(404)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 404,
    })
  })
  it(`PUT /endorsement-list/:listId/close should close existing endorsement list`, async () => {
    const response = await request(app.getHttpServer())
      .put('/endorsement-list/9c0b4106-4213-43be-a6b2-ff324f4ba0c2/close')
      .send()
      .expect(200)

    expect(response.body).toMatchObject({ closedDate: expect.any(String) })
  })

  it(`POST /endorsement-list should create new endorsement list`, async () => {
    const newEndorsementList = {
      title: 'Some title',
      description: 'Some description',
      tags: ['nordausturkjordaemi'],
      endorsementMeta: ['fullName'],
      validationRules: [
        {
          type: 'minAgeAtDate',
          value: '2021-03-15:18',
        },
      ],
    }
    const response = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(201)

    expect(response.body).toMatchObject(newEndorsementList) // should return the created object
  })
  it(`POST /endorsement-list should return error when data is invalid`, async () => {
    const newEndorsementList = {
      title: 123, // invalid
      description: 'Some description',
      tags: ['nordausturkjordaemi'],
      endorsementMeta: ['fullName'],
      validationRules: [
        {
          type: 'minAgeAtDate',
          value: '2021-03-15:18',
        },
      ],
    }
    const response = await request(app.getHttpServer())
      .post('/endorsement-list')
      .send(newEndorsementList)
      .expect(400)

    expect(response.body).toMatchObject({
      ...errorExpectedStructure,
      statusCode: 400,
    })
  })
})
