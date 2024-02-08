/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing'
import { NewDiscountService } from '../newDiscount.service'
import { UsersApi } from '@island.is/clients/air-discount-scheme'

import { createLogger } from 'winston'
import {
  fabAuthUser,
  fabCreateDiscount,
  fabGetDiscount,
  fabTUser,
  idsForGetUserRelations,
  userRelationsWardResponse,
} from './mocksForTesting'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'

describe('NewDiscountService', () => {
  let service: NewDiscountService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: createLogger({
            silent: true,
          }),
        },
        {
          provide: UsersApi,
          useFactory: () => ({
            withMiddleware: () => ({
              privateNewDiscountControllerGetCurrentDiscountByNationalId:
                jest.fn((params: { nationalId: string }) => {
                  return new Promise((resolve) =>
                    resolve(fabGetDiscount(params.nationalId)),
                  )
                }),
              privateNewDiscountControllerCreateDiscountCode: jest.fn(
                (input: {
                  nationalId: string
                  _body: {
                    origin: string
                    destination: string
                    isRoundTrip: boolean
                  }
                }) => {
                  return new Promise((resolve) =>
                    resolve(fabCreateDiscount(input.nationalId)),
                  )
                },
              ),
              privateUserControllerGetUserRelations: jest.fn((user) => {
                return new Promise((resolve) => {
                  const userRelationsResponse = [fabTUser(user.nationalId)]
                  if (idsForGetUserRelations.includes(user.nationalId)) {
                    userRelationsResponse.push(...userRelationsWardResponse)
                  }
                  resolve(userRelationsResponse)
                })
              }),
            }),
          }),
        },
        NewDiscountService,
      ],
    }).compile()

    service = module.get<NewDiscountService>(NewDiscountService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getDiscounts', () => {
    it('return true if discount is active', async () => {
      const response = await service.discountIsValid(
        fabGetDiscount('1010303019'),
      )

      expect(response).toBe(true)
    })
    it('should return a discount if privateNewDiscountControllerGetCurrentDiscountByNationalId returns a discount', async () => {
      const user = fabAuthUser('1010303019')
      const discount = fabGetDiscount('1010303019')
      const expectedDiscount = {
        ...discount,
        user: { ...discount.user, name: discount.user.firstName },
      }

      const getDiscount = await service.getCurrentDiscount(user)

      expect(getDiscount).toStrictEqual(expectedDiscount)
    })

    it('should return return multiple discounts for relations', async () => {
      const originalUser = fabAuthUser('1010307789')
      const relationUsers = [fabTUser('2222222229'), fabTUser('3333333339')]
      const discount = fabGetDiscount('1010307789')
      const relationalDiscounts = relationUsers.map((user) => {
        const discount = fabGetDiscount(user.nationalId)
        return {
          ...discount,
          user: { ...discount.user, name: discount.user.firstName },
        }
      })

      const expectedDiscounts = [
        {
          ...discount,
          user: { ...discount.user, name: discount.user.firstName },
        },
        ...relationalDiscounts,
      ]

      const getDiscounts = await service.getCurrentDiscounts(originalUser)

      expect(getDiscounts).toStrictEqual(expectedDiscounts)
    })

    it('should throw an error', async () => {
      const user = fabAuthUser('1010303019')

      jest
        .spyOn(service as any, 'getADSWithAuth')
        .mockImplementationOnce(() => {
          return {
            privateNewDiscountControllerGetCurrentDiscountByNationalId: jest.fn(
              () => {
                return Promise.reject({
                  status: 400,
                  message: 'test error',
                })
              },
            ),
          }
        })
      try {
        const sell = await service.getCurrentDiscount(user)
        expect(sell).toBeUndefined()
      } catch (e) {
        expect(e).toBeTruthy()
        expect(e).toBeInstanceOf(ApolloError)
        expect(e.message).toBe('Failed to resolve request')
      }
    })

    it('should return null if json error', async () => {
      const user = fabAuthUser('1010303019')

      jest
        .spyOn(service as any, 'getADSWithAuth')
        .mockImplementationOnce(() => {
          return {
            privateNewDiscountControllerGetCurrentDiscountByNationalId: jest.fn(
              () => {
                return Promise.reject({
                  status: 400,
                  message: 'invalid json',
                })
              },
            ),
          }
        })

      const sell = await service.getCurrentDiscount(user)
      expect(sell).toBeNull()
    })
    it('should return null if error status is 403', async () => {
      const user = fabAuthUser('1010303019')

      jest
        .spyOn(service as any, 'getADSWithAuth')
        .mockImplementationOnce(() => {
          return {
            privateNewDiscountControllerGetCurrentDiscountByNationalId: jest.fn(
              () => {
                return Promise.reject({
                  status: 403,
                  message: 'Something else',
                })
              },
            ),
          }
        })

      const sell = await service.getCurrentDiscount(user)
      expect(sell).toBeNull()
    })
    it('should return null if error status is 404', async () => {
      const user = fabAuthUser('1010303019')

      jest
        .spyOn(service as any, 'getADSWithAuth')
        .mockImplementationOnce(() => {
          return {
            privateNewDiscountControllerGetCurrentDiscountByNationalId: jest.fn(
              () => {
                return Promise.reject({
                  status: 404,
                  message: 'Something else',
                })
              },
            ),
          }
        })

      const sell = await service.getCurrentDiscount(user)
      expect(sell).toBeNull()
    })
  })
  describe('userRelations', () => {
    it('should return empty array if error', async () => {
      const user = fabAuthUser('1010303019')

      jest
        .spyOn(service as any, 'getADSWithAuth')
        .mockImplementationOnce(() => {
          return {
            privateUserControllerGetUserRelations: jest.fn(() => {
              return Promise.reject({
                status: 404,
                message: 'Something else',
              })
            }),
          }
        })

      const sell = await service.getCurrentDiscounts(user)
      expect(sell).toHaveLength(0)
    })
  })
  describe('createDiscount', () => {
    it('should return createdDiscount', async () => {
      const user = fabAuthUser('1010303019')
      const input = {
        origin: 'KEF',
        destination: 'AEY',
        isRoundTrip: true,
      }
      const discount = fabCreateDiscount(user.nationalId)
      const expectedDiscount = {
        ...discount,
        user: { ...discount.user, name: discount.user.firstName },
      }

      const result = await service.createDiscount(user, input)
      expect(result).toStrictEqual(expectedDiscount)
    })
    it('should return null if error', async () => {
      const user = fabAuthUser('1010303019')
      const input = {
        origin: 'KEF',
        destination: 'AEY',
        isRoundTrip: true,
      }
      jest
        .spyOn(service as any, 'getADSWithAuth')
        .mockImplementationOnce(() => {
          return {
            privateNewDiscountControllerCreateDiscountCode: jest.fn(() => {
              return Promise.reject({
                status: 404,
                message: 'Something else',
              })
            }),
          }
        })

      const sell = await service.createDiscount(user, input)
      expect(sell).toBeNull()
    })
  })
})
