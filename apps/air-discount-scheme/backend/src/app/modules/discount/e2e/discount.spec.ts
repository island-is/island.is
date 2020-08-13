import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

let app: INestApplication

beforeAll(async () => {
  app = await setup()
})

describe('Public Discount', () => {
  it(`GET /public/discount/:discountCode?nationalId should return data`, async () => {
    const response = await request(app.getHttpServer())
      .get('/public/discount/12345678?nationalId=2101932009')
      .expect(200)

    expect(response.body.discountCode).toBeTruthy()
  })

  it('GET /public/discount/:discountCode with wrong format for discountCode should return bad request', async () => {
    await request(app.getHttpServer())
      .get('/public/discount/1234567?nationalId=1234567890')
      .expect(400)
  })

  it('GET /public/discount/:discountCode without query should return bad request', async () => {
    await request(app.getHttpServer())
      .get('/public/discount/12345678?nationalId=123456789')
      .expect(400)
  })

  it('GET /public/discount/:discountCode with wrong format on nationalId should return bad request', async () => {
    const response = await request(app.getHttpServer())
      .get('/public/discount/12345678?nationalId=123456789')
      .expect(400)
  })
})
