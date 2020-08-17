import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Public Discount', () => {
  it(`GET /public/users/:nationalId/discounts/:discountCode should return data`, async () => {
    const response = await request(app.getHttpServer())
      .get('/public/users/2101932009/discounts/12345678')
      .expect(200)

    expect(response.body.discountCode).toBeTruthy()
  })

  it('GET /public/users/:nationalId/discounts/:discountCode with wrong format for discountCode should return bad request', async () => {
    await request(app.getHttpServer())
      .get('/public/users/1234567890/discounts/1234567')
      .expect(400)
  })

  it('GET /public/users/:nationalId/discounts/:discountCode without query should return bad request', async () => {
    await request(app.getHttpServer())
      .get('/public/users/123456789/discounts/12345678')
      .expect(400)
  })

  it('GET /public/users/:nationalId/discount/:discountCode with wrong format on nationalId should return bad request', async () => {
    await request(app.getHttpServer())
      .get('/public/users/123456789/discounts/12345678')
      .expect(400)
  })
})
