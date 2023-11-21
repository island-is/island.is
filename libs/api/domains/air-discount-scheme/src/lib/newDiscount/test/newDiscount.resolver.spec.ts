import { User } from '@island.is/auth-nest-tools'
import { Test, TestingModule } from '@nestjs/testing'
import { NewDiscountResolver } from '../newDiscount.resolver'
import { NewDiscountService } from '../newDiscount.service'
import {fabTUser, fabGetDiscount, idsForGetDiscount, idsForCreateDiscount, idsForGetUserRelations, fabInvalidDiscount, fabAuthUser, fabCreateDiscount, userRelationsWardResponse} from './mocksForTesting'

import {
  NewDiscount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'

describe('ApiDomains: NewDiscountResolver', () => {
  let resolver: NewDiscountResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewDiscountResolver,
        {
          provide: NewDiscountService,
          useFactory: () => ({
            // Is there a nicer way to mock a service while keeping some of its methods unchanged?
            getCurrentDiscounts:
              NewDiscountService.prototype.getCurrentDiscounts,
            getCurrentDiscount: NewDiscountService.prototype.getCurrentDiscount,
            getDiscount: jest.fn(
              (user: User, nationalId: string): TDiscount | void => {
                if (idsForGetDiscount.includes(nationalId)) {
                  return fabGetDiscount(nationalId)
                }
                return undefined
              },
            ),
            createDiscount: jest.fn(
              (
                user: User,
                _input: {
                  origin: string
                  destination: string
                  isRoundTrip: boolean
                },
              ): TDiscount | null => {
                if (idsForCreateDiscount.includes(user.nationalId)) {
                  return fabCreateDiscount(user.nationalId)
                }
                return fabInvalidDiscount(user.nationalId)
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

    resolver = module.get<NewDiscountResolver>(NewDiscountResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('Eligible users', () => {
    describe('getDiscount', () => {
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

      it("An eligible user with eligible wards should get their own discount and their wards'", async () => {
        const user = fabAuthUser('1010307789')
        const knownWard = '2222222229'
        const expectedDiscounts = [
          fabGetDiscount(user.nationalId),
          fabGetDiscount(knownWard),
        ]

        const discountsWithUser = await resolver.getDiscount(user)

        expect(discountsWithUser).toHaveLength(2)

        expect(discountsWithUser).toEqual(
          expect.arrayContaining(
            expectedDiscounts.map(expect.objectContaining),
          ),
        )

        const nationalIds = discountsWithUser.map(
          (discountWithuser) => discountWithuser.user.nationalId,
        )
        expect(nationalIds).toEqual([user.nationalId, knownWard])
      })
    })
    describe('getDiscountByNationalId', () => {
      it('A user with an active discount gets their discount back', async () => {
        const user = fabAuthUser('1010303019')
        const discountWithUser = await resolver.getDiscountByNationalId(user)
        const expectedDiscount = fabGetDiscount(user.nationalId)

        expect(discountWithUser).toEqual(
          expect.objectContaining(expectedDiscount),
        )
      })
    })
    describe('createDiscount', () => {
      it('A user that creates a discount should recieve their discount', async () => {
        const user = fabAuthUser('3333333339')
        const discountWithUser = await resolver.createNewDiscount(user, {
          origin: 'AEY',
          destination: 'RKV',
          isRoundTrip: true,
        })
        const expectedDiscount = fabCreateDiscount(user.nationalId)

        expect(discountWithUser).toEqual(
          expect.objectContaining(expectedDiscount),
        )
      })
    })
  })

  describe('Ineligible users', () => {
    describe('createDiscount', () => {
      it('A ineligable user that creates a discount should recieve null', async () => {
        const user = fabAuthUser('1010302719')
        const discountWithUser = await resolver.createNewDiscount(user, {
          origin: 'AEY',
          destination: 'RKV',
          isRoundTrip: true,
        })
        const expectedDiscount = null

        expect(discountWithUser).toEqual(expectedDiscount)
      })
    })
    describe('getDiscountByNationalId', () => {
      it('A user with no active discount should receive null', async () => {
        const user = fabAuthUser('1010302719')
        const discountWithUser = await resolver.getDiscountByNationalId(user)

        expect(discountWithUser).toEqual(null)
      })
    })
    describe('getDiscount', () => {
      it('A user who is not eligible and does not have any eligible wards, should not get any discounts', async () => {
        const user = fabAuthUser('1010302719')
        const discountsWithUser = await resolver.getDiscount(user)
        expect(discountsWithUser).toHaveLength(0)
      })

      it("A user who is not eligible, but has eligible wards, should get their wards' discounts", async () => {
        const custodian = '1010302989'
        const knownWards = '2222222229'
        const expectedDiscounts = [
          fabInvalidDiscount(custodian),
          fabGetDiscount(knownWards),
        ]

        const user = fabAuthUser(custodian)
        const discountsWithUser = await resolver.getDiscount(user)

        expect(discountsWithUser).toHaveLength(1)

        expect(discountsWithUser).toEqual([expectedDiscounts[1]])
      })
    })
  })
})
