import request from 'supertest'
import { Cache as CacheManager } from 'cache-manager'
import { INestApplication } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../../../nationalRegistry'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import { User } from '@island.is/air-discount-scheme/types'
import { AuthGuard } from '../../../common'
import { setup } from '../../../../../../test/setup'

let app: INestApplication
let cacheManager: CacheManager
let nationalRegistryService: NationalRegistryService
const user: NationalRegistryUser = {
  nationalId: '1326487905',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 900,
  city: 'Vestmannaeyjar',
}

const discountUser: User = {
  ...user,
  fund: {
    credit: 0,
    total: 6,
    used: 0,
  },
}

const mockAuthGuard = new MockAuthGuard({
  nationalId: '1326487905',
  scope: [AirDiscountSchemeScope.default],
})

beforeAll(async () => {
  app = await setup({
    override: (builder) =>
      builder
        .overrideGuard(IdsUserGuard)
        .useValue(mockAuthGuard)
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: () => true }),
  })
  cacheManager = app.get<CacheManager>(CACHE_MANAGER)
  cacheManager.store.ttl = () => Promise.resolve(0)
  nationalRegistryService = app.get<NationalRegistryService>(
    NationalRegistryService,
  )
  jest
    .spyOn(nationalRegistryService, 'getUser')
    .mockImplementation(() => Promise.resolve(user))

  Date.now = jest.fn(() => 1597760782018)
})

describe('Create DiscountCode', () => {
  it(`POST /api/private/users/:nationalId/discounts should return data`, async () => {
    const nationalId = '1326487905'
    const spy = jest.spyOn(cacheManager, 'set')
    const response = await request(app.getHttpServer())
      .post(`/api/private/users/${nationalId}/discounts`)
      .expect(201)

    expect(response.body).toEqual({
      connectionDiscountCodes: [],
      discountCode: expect.any(String),
      expiresIn: 86400,
      nationalId,
      user: {
        ...user,
        fund: {
          credit: expect.any(Number),
          total: expect.any(Number),
          used: expect.any(Number),
        },
      },
    })
    expect(spy).toHaveBeenCalled()
  })
  it(`GET /api/public/discounts/:discountCode/user should return data`, async () => {
    Date.now = () => 1640995200000 // 2022
    const nationalId = '1326487905'
    const spy1 = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation(() =>
        Promise.resolve({ nationalId, user: discountUser }),
      )
    const spy2 = jest
      .spyOn(nationalRegistryService, 'getUser')
      .mockImplementation(() =>
        Promise.resolve({
          nationalId: '1326487905',
          firstName: 'Jón',
          gender: 'kk',
          lastName: 'Jónsson',
          middleName: 'Gunnar',
          address: 'Bessastaðir 1',
          postalcode: 225,
          city: 'Álftanes',
        }),
      )
    const response = await request(app.getHttpServer())
      .get(`/api/public/discounts/12345678/user`)
      .expect(200)
    spy1.mockRestore()
    spy2.mockRestore()

    expect(response.body).toEqual({
      nationalId: '132648xxx5',
      firstName: 'Jón',
      gender: 'kk',
      lastName: 'Jónsson',
      middleName: 'Gunnar',
      fund: {
        credit: 0,
        used: 0,
        total: 6,
      },
    })
  })
})
