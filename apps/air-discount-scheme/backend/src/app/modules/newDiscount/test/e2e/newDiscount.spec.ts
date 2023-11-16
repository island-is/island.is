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
import { NewDiscount } from '../../newDiscount.model'
import {mockDiscount} from './mocks'
import { NewDiscountService } from '../../newDiscount.service'

let app: INestApplication
let cacheManager: CacheManager
let nationalRegistryService: NationalRegistryService
let newDiscountService: NewDiscountService
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
  nationalRegistryService = app.get<NationalRegistryService>(
    NationalRegistryService,
  )
  newDiscountService = app.get<NewDiscountService>(NewDiscountService)

  jest
    .spyOn(nationalRegistryService, 'getUser')
    .mockImplementation(() => Promise.resolve(user))

  jest
    .spyOn(newDiscountService, 'createNewDiscountCode')
    .mockImplementation(() => Promise.resolve(mockDiscount as any)),
    (Date.now = jest.fn(() => 1597760782018))
})

describe('Create DiscountCode', () => {
  it(`POST /api/private/users/:nationalId/newDiscounts should return data`, async () => {
    const nationalId = '1326487905'
    const response = await request(app.getHttpServer())
      .post(`/api/private/users/${nationalId}/newDiscounts`)
      .send({
        origin: 'GRY',
        destination: 'RKV',
        isRoundTrip: true,
      })
      .expect(201)

    expect(response.body).toEqual(mockDiscount)
  })
})
