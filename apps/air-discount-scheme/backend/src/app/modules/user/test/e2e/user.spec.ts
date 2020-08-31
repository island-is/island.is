import { setup } from '../../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication, CACHE_MANAGER } from '@nestjs/common'
import CacheManger from 'cache-manager'
import { ThjodskraService } from '../../../thjodskra'

let app: INestApplication
let cacheManager: CacheManger
let thjodskraService: ThjodskraService

beforeAll(async () => {
  app = await setup()
  cacheManager = app.get<CacheManger>(CACHE_MANAGER)
  cacheManager.ttl = () => ''
  thjodskraService = app.get<ThjodskraService>(ThjodskraService)
})

describe('Get Discount By DiscountCode', () => {
  it(`GET /api/public/discounts/:discountCode/user should return data`, async () => {
    const nationalId = '1326487905'
    const spy1 = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() => Promise.resolve({ nationalId }))
    const spy2 = jest
      .spyOn(thjodskraService, 'getUser')
      .mockImplementation(() =>
        Promise.resolve({
          source: 'Þjóðskrá',
          lastmodified: '',
          charged: false,
          ssn: '1326487905',
          name: 'Jón Gunnar Jónsson',
          gender: 'kk',
          address: 'Bessastaðir 1',
          postalcode: 225,
          city: 'Álftanes',
        }),
      )
    const response = await request(app.getHttpServer())
      .get(`/api/public/discounts/12345678/user`)
      .set('Authorization', 'Bearer ernir')
      .expect(200)
    spy1.mockRestore()
    spy2.mockRestore()

    expect(response.body).toEqual({
      nationalId: '1326487905',
      firstName: 'Jón',
      gender: 'kk',
      lastName: 'Jónsson',
      middleName: 'Gunnar',
      address: 'Bessastaðir 1',
      postalcode: 225,
      city: 'Álftanes',
      fund: {
        nationalId: '1326487905',
        credit: 0,
        used: 0,
        total: 4,
      },
    })
  })
})
