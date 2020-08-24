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

describe('Get Discount By DiscountCode', () => {
  it(`GET /api/public/discounts/:discountCode/user should return data`, async () => {
    const nationalId = '1326487905'
    const spy = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() => Promise.resolve({ nationalId }))
    const response = await request(app.getHttpServer())
      .get(`/api/public/discounts/12345678/user`)
      .expect(200)
    spy.mockRestore()

    expect(response.body).toEqual({
      flightLegsLeft: 4,
      nationalId: '1326487905',
      firstName: 'Jón',
      gender: 'Male',
      lastName: 'Jónsson',
      middleName: 'Gunnar',
    })
  })
})
