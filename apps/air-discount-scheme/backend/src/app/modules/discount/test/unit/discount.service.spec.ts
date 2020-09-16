import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/common'
import { CacheManager } from 'cache-manager'

import { DiscountService, DISCOUNT_CODE_LENGTH } from '../../discount.service'

describe('DiscountService', () => {
  let discountService: DiscountService
  let cacheManager: CacheManager

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DiscountService,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
            del: () => ({}),
            ttl: () => ({}),
          })),
        },
      ],
    }).compile()

    discountService = moduleRef.get<DiscountService>(DiscountService)
    cacheManager = moduleRef.get<CacheManager>(CACHE_MANAGER)
  })

  describe('createDiscountCode', () => {
    it('should create a discount and cache it', async () => {
      const nationalId = '1234567890'
      const cacheManagerSpy = jest.spyOn(cacheManager, 'set')

      const result = await discountService.createDiscountCode(nationalId)

      expect(cacheManagerSpy).toHaveBeenCalledTimes(5)
      expect(result.discountCode).toHaveLength(DISCOUNT_CODE_LENGTH)
    })
  })

  describe('getDiscountByNationalId', () => {
    it('should return discountCode if it is cached', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const ttl = 86400
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => ({ discountCode }))
      const cacheManagerTtlSpy = jest
        .spyOn(cacheManager, 'ttl')
        .mockImplementation(() => ttl)

      const result = await discountService.getDiscountByNationalId(nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalled()
      expect(cacheManagerTtlSpy).toHaveBeenCalled()
      expect(result).toEqual({
        discountCode,
        nationalId,
        expiresIn: ttl,
      })
    })

    it('should return null if it is not in cache', async () => {
      const nationalId = '1234567890'
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => null)

      const result = await discountService.getDiscountByNationalId(nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalled()
      expect(result).toBe(null)
    })
  })

  describe('getDiscountByDiscountCode', () => {
    it('should return discount if it is cached', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const ttl = 86400
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => ({ nationalId }))
      const cacheManagerTtlSpy = jest
        .spyOn(cacheManager, 'ttl')
        .mockImplementation(() => ttl)

      const result = await discountService.getDiscountByDiscountCode(
        discountCode,
      )

      expect(cacheManagerGetSpy).toHaveBeenCalled()
      expect(cacheManagerTtlSpy).toHaveBeenCalled()
      expect(result).toEqual({
        discountCode,
        nationalId,
        expiresIn: ttl,
      })
    })

    it('should return null if it is not in cache', async () => {
      const nationalId = '1234567890'
      const cacheManagerSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => null)

      const result = await discountService.getDiscountByDiscountCode(nationalId)

      expect(cacheManagerSpy).toHaveBeenCalled()
      expect(result).toBe(null)
    })
  })

  describe('useDiscount', () => {
    it('should delete discount from cache', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const cacheManagerSpy = jest
        .spyOn(cacheManager, 'del')
        .mockImplementation(() => null)

      await discountService.useDiscount(discountCode, nationalId)

      expect(cacheManagerSpy).toHaveBeenCalledTimes(2)
    })
  })
})
