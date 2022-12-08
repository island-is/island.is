import { User } from '@island.is/auth-nest-tools'
import { Test, TestingModule } from '@nestjs/testing'
import { AirDiscountSchemeResolver } from './api-domains-air-discount-scheme.resolver'
import { AirDiscountSchemeService } from './api-domains-air-discount-scheme.service'

import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { ApiScope } from '@island.is/auth/scopes'

describe('ApiDomains: AirDiscountSchemeResolver', () => {
  let resolver: AirDiscountSchemeResolver

  const idsForGetDiscount = ['1010303019', '1010307789', '2222222229']
  const idsForCreateDiscount = ['1010302399', '3333333339']
  const idsForGetUserRelations = ['1010307789', '1010302989']

  const fabAuthUser = (nationalId: string): User => ({
    authorization: '',
    client: '',
    nationalId,
    scope: [ApiScope.internal],
  })

  const fabGetDiscount = (nationalId: string): TDiscount => ({
    connectionDiscountCodes: [],
    discountCode: 'GETDISCO',
    expiresIn: 86400,
    nationalId,
  })

  const fabCreateDiscount = (nationalId: string): TDiscount => ({
    connectionDiscountCodes: [],
    discountCode: 'CREATEDC',
    expiresIn: 86400,
    nationalId,
  })

  const fabTUser = (nationalId: string): TUser => ({
    address: 'Neinsstaðarból 18',
    city: 'Reykjavík',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'kk',
    nationalId,
    postalcode: 200,
    fund: {
      credit: 6,
      total: 6,
      used: 0,
    },
  })

  const userRelationsWardResponse: TUser[] = [
    fabTUser('2222222229'),
    fabTUser('3333333339'),
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirDiscountSchemeResolver,
        {
          provide: AirDiscountSchemeService,
          useFactory: () => ({
            // Is there a nicer way to mock a service while keeping some of its methods unchanged?
            getCurrentDiscounts:
              AirDiscountSchemeService.prototype.getCurrentDiscounts,

            getDiscount: jest.fn(
              (user: User, nationalId: string): TDiscount | void => {
                if (idsForGetDiscount.includes(nationalId)) {
                  return fabGetDiscount(nationalId)
                }
                return undefined
              },
            ),
            createDiscount: jest.fn(
              (user: User, nationalId: string): TDiscount | null => {
                if (idsForCreateDiscount.includes(nationalId)) {
                  return fabCreateDiscount(nationalId)
                }
                return null
              },
            ),
            getUserRelations: jest.fn((user: User): TUser[] => {
              const userRelationsResponse = [fabTUser(user.nationalId)]
              if (idsForGetUserRelations.includes(user.nationalId)) {
                userRelationsResponse.push(...userRelationsWardResponse)
              }
              return userRelationsResponse
            }),
          }),
        },
      ],
    }).compile()

    resolver = module.get<AirDiscountSchemeResolver>(AirDiscountSchemeResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('Eligible users', () => {
    it('A user with an active discount gets their discount back', async () => {
      const user = fabAuthUser('1010303019')
      const discountsWithUser = await resolver.getDiscount(user)
      const expectedDiscount = fabGetDiscount(user.nationalId)

      expect(discountsWithUser).toHaveLength(1)
      const discountWithUser = discountsWithUser.pop()

      expect(discountWithUser).toEqual(
        expect.objectContaining(expectedDiscount),
      )
    })

    it('A user without an active discount, but is eligible, should have a discount created', async () => {
      const user = fabAuthUser('1010302399')
      const discountsWithUser = await resolver.getDiscount(user)
      const expectedDiscount = fabCreateDiscount(user.nationalId)

      expect(discountsWithUser).toHaveLength(1)
      const discountWithUser = discountsWithUser.pop()

      expect(discountWithUser).toEqual(
        expect.objectContaining(expectedDiscount),
      )
    })

    it("An eligible user with eligible wards should get their own discount and their wards'", async () => {
      const user = fabAuthUser('1010307789')
      const knownWards = ['2222222229', '3333333339']
      const expectedDiscounts = [
        fabGetDiscount(user.nationalId),
        fabGetDiscount(knownWards[0]),
        fabCreateDiscount(knownWards[1]),
      ]

      const discountsWithUser = await resolver.getDiscount(user)

      expect(discountsWithUser).toHaveLength(3)

      // https://jestjs.io/docs/expect#expectarraycontainingarray
      // https://jestjs.io/docs/expect#expectobjectcontainingobject
      //
      // This clause is simply asking
      // With discountsWithUser DU
      //   For every expectedDiscount E
      //     is E found completely in some DU
      expect(discountsWithUser).toEqual(
        expect.arrayContaining(expectedDiscounts.map(expect.objectContaining)),
      )

      const nationalIds = discountsWithUser.map(
        (discountWithuser) => discountWithuser.user.nationalId,
      )
      expect(nationalIds).toEqual([user.nationalId, ...knownWards])
    })
  })

  describe('Ineligible users', () => {
    it('A user who is not eligible and does not have any eligible wards, should not get any discounts', async () => {
      const user = fabAuthUser('1010302719')
      const discountsWithUser = await resolver.getDiscount(user)
      expect(discountsWithUser).toHaveLength(0)
    })

    it("A user who is not eligible, but has eligible wards, should get their wards' discounts and nothing else", async () => {
      const knownWards = ['2222222229', '3333333339']
      const expectedDiscounts = [
        fabGetDiscount(knownWards[0]),
        fabCreateDiscount(knownWards[1]),
      ]

      const user = fabAuthUser('1010302989')
      const discountsWithUser = await resolver.getDiscount(user)

      expect(discountsWithUser).toHaveLength(2)

      expect(discountsWithUser).toEqual(
        expect.arrayContaining(expectedDiscounts.map(expect.objectContaining)),
      )

      const nationalIds = discountsWithUser.map(
        (discountWithuser) => discountWithuser.user.nationalId,
      )
      expect(nationalIds).toEqual(knownWards)
    })
  })
})
