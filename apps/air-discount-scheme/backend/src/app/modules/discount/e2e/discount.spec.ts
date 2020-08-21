import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication, CACHE_MANAGER } from '@nestjs/common'
import { FlightService } from '../../flight'
import CacheManger from 'cache-manager'

let app: INestApplication
let cacheManager: CacheManger

beforeAll(async () => {
  app = await setup()
  cacheManager = app.get<CacheManger>(CACHE_MANAGER)

  Date.now = jest.fn(() => 1597760782018)
})

describe('Create DiscountCode', () => {
  it(`POST /private/users/:nationalId/discounts should return data`, async () => {
    const nationalId = '1326487905'
    const spy = jest.spyOn(cacheManager, 'set')
    const response = await request(app.getHttpServer())
      .post(`/private/users/${nationalId}/discounts`)
      .expect(201)

    expect(response.body).toEqual({
      discountCode: expect.any(String),
      expires: '2020-08-19T14:26:22.018Z',
      nationalId,
    })
    expect(spy).toHaveBeenCalled()
  })

  // TODO enable this test when we add the flightlegs check
  /* it(`POST /private/users/:nationalId/discounts with no flightlegs left should return forbidden`, async () => { */
  /*   const spy = jest */
  /*     .spyOn(flightService, 'countFlightLegsLeftByNationalId') */
  /*     .mockImplementation(() => Promise.resolve(0)) */
  /*   await request(app.getHttpServer()) */
  /*     .post('/private/users/1326487905/discounts') */
  /*     .expect(403) */
  /*   spy.mockRestore() */
  /* }) */
})
