import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication, CACHE_MANAGER } from '@nestjs/common'
import CacheManger from 'cache-manager'

let app: INestApplication
let cacheManager: CacheManger

beforeAll(async () => {
  app = await setup()
  cacheManager = app.get<CacheManger>(CACHE_MANAGER)
  cacheManager.ttl = () => ''
})

describe('Create Flight', () => {
  it(`POST /api/public/discounts/:discountCode/flights should create a flight`, async () => {
    const spy = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() => ({ nationalId: '1234567890' }))
    const response = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer ernir')
      .send({
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

    expect(response.body).toEqual({
      id: expect.any(String),
      invalid: false,
      created: expect.any(String),
      modified: expect.any(String),
      nationalId: '1234567890',
      bookingDate: '2020-08-17T12:35:50.971Z',
      airline: 'ernir',
      flightLegs: [
        {
          id: expect.any(String),
          flightId: expect.any(String),
          date: '2021-03-12T12:35:50.971Z',
          destination: 'AK',
          discountPrice: 30000,
          origin: 'REK',
          originalPrice: 50000,
          created: expect.any(String),
          modified: expect.any(String),
        },
        {
          id: expect.any(String),
          flightId: expect.any(String),
          date: '2021-03-15T12:35:50.971Z',
          destination: 'REK',
          discountPrice: 60000,
          origin: 'AK',
          originalPrice: 100000,
          created: expect.any(String),
          modified: expect.any(String),
        },
      ],
    })

    spy.mockRestore()
  })

  it('POST /api/public/discounts/:discountCode/flights should return bad request when flightLegs are omitted', async () => {
    await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer ernir')
      .send({
        nationalId: '1234567890',
        bookingDate: '2020-08-17T12:35:50.971Z',
      })
      .expect(400)
  })
})

describe('Delete Flight', () => {
  it(`DELETE /api/public/flights/:flightId should delete a flight`, async () => {
    const spy = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() => ({ nationalId: '1234567890' }))
    const createRes = await request(app.getHttpServer())
      .post('/api/public/discounts/12345678/flights')
      .set('Authorization', 'Bearer airIcelandConnect')
      .send({
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
    spy.mockRestore()

    await request(app.getHttpServer())
      .delete(`/api/public/flights/${createRes.body.id}`)
      .set('Authorization', 'Bearer airIcelandConnect')
      .expect(204)

    const getRes = await request(app.getHttpServer())
      .get(`/api/private/flights`)
      .expect(200)

    expect(getRes.body.length).toBe(0)
  })

  it(`DELETE /api/public/flights/:flightId should validate flightId`, async () => {
    await request(app.getHttpServer())
      .delete('/api/public/flights/this-is-not-uuid')
      .set('Authorization', 'Bearer ernir')
      .expect(400)
  })

  it(`DELETE /api/public/flights/:flightId should return not found if flight does not exist`, async () => {
    await request(app.getHttpServer())
      .delete('/api/public/flights/dfac526d-5dc0-4748-b858-3d9cd2ae45be')
      .set('Authorization', 'Bearer ernir')
      .expect(404)
  })
})
