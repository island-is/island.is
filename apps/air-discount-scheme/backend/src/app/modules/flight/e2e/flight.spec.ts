import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Flight', () => {
  it(`POST /public/flight should create a flight`, async () => {
    const response = await request(app.getHttpServer())
      .post('/public/flight')
      .send({ nationalId: '1234567890', numberOfLegs: 2 })
      .expect(201)

    expect(response.body.id).toBeTruthy()
  })

  it('POST /public/flight should return bad request when shorter ssn', async () => {
    const response = await request(app.getHttpServer())
      .post('/public/flight')
      .send({ nationalId: '123456789', numberOfLegs: 2 })
      .expect(400)
  })
})
