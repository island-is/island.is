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
      .send({
        nationalId: '1234567890',
        bookingDate: '2020-08-17T12:35:50.971Z',
        flightLegs: [
          {
            origin: 'REK',
            destination: 'AK',
            originalPrice: 50000,
            discountPrice: 30000,
            date: '2021-03-12T12:35:50.971Z',
          },
          {
            origin: 'AK',
            destination: 'REK',
            originalPrice: 100000,
            discountPrice: 60000,
            date: '2021-03-15T12:35:50.971Z',
          },
        ],
      })
      .expect(201)

    expect(response.body.id).toBeTruthy()
    expect(response.body.flightLegs.length).toBe(2)
  })

  it('POST /public/flight should return bad request when flightLegs are omitted', async () => {
    await request(app.getHttpServer())
      .post('/public/flight')
      .send({
        nationalId: '1234567890',
        bookingDate: '2020-08-17T12:35:50.971Z',
      })
      .expect(400)
  })
})
