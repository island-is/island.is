import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Resource', () => {
  it(`POST /resource should register resource`, async () => {
    // Act
    const response = await request(app.getHttpServer())
      .post('/resource')
      .send({ nationalId: '1234561234' })
      .expect(201)

    // Assert
    expect(response.body.id).toBeTruthy()
  })

  it('POST /resource should return bad request when shorter ssn', async () => {
    // ACT
    const response = await request(app.getHttpServer())
      .post('/resource')
      .send({ nationalId: '123456123' })
      .expect(400)

    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      message: ['nationalId must be longer than or equal to 10 characters'],
    })
  })
})
