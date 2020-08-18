import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { FlightService } from '../../flight'

let app: INestApplication
let flightService: FlightService

beforeAll(async () => {
  app = await setup()
  flightService = app.get<FlightService>(FlightService)

  Date.now = jest.fn(() => 1597760782018)
})

describe('Get Discount By DiscountCode', () => {
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

  it('GET /public/users/:nationalId/discount/:discountCode with no flightLegs left should return forbidden', async () => {
    const spy = jest
      .spyOn(flightService, 'countFlightLegsByNationalId')
      .mockImplementation(() => Promise.resolve(4))
    await request(app.getHttpServer())
      .get('/public/users/1234567890/discounts/12345678')
      .expect(403)
    spy.mockRestore()
  })
})

describe('Create DiscountCode', () => {
  it(`POST /private/users/:nationalId/discounts should return data`, async () => {
    const response = await request(app.getHttpServer())
      .post('/private/users/2101932009/discounts')
      .expect(201)

    expect(response.body.discountCode).toBeTruthy()
  })

  it(`POST /private/users/:nationalId/discounts with no flightlegs left should return forbidden`, async () => {
    const spy = jest
      .spyOn(flightService, 'countFlightLegsByNationalId')
      .mockImplementation(() => Promise.resolve(4))
    await request(app.getHttpServer())
      .post('/private/users/2101932009/discounts')
      .expect(403)
    spy.mockRestore()
  })
})
