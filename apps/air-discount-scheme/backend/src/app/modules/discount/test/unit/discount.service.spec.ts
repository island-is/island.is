import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/common'

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

      const uuid = cacheManagerSpy.mock.calls[0][0]
      expect(cacheManagerSpy.mock.calls[1][1]).toBe(uuid)
      expect(cacheManagerSpy.mock.calls[2][1]).toBe(uuid)

      expect(cacheManagerSpy).toHaveBeenCalledTimes(3)
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
        .mockImplementation(() => Promise.resolve({ discountCode }))
      const cacheManagerTtlSpy = jest
        .spyOn(cacheManager, 'ttl')
        .mockImplementation(() => Promise.resolve(ttl))

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
        .mockImplementation(() => Promise.resolve(null))

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
        .mockImplementation(() => Promise.resolve({ nationalId }))
      const cacheManagerTtlSpy = jest
        .spyOn(cacheManager, 'ttl')
        .mockImplementation(() => Promise.resolve(ttl))

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
        .mockImplementation(() => Promise.resolve(null))

      const result = await discountService.getDiscountByDiscountCode(nationalId)

      expect(cacheManagerSpy).toHaveBeenCalled()
      expect(result).toBe(null)
    })
  })

  describe('useDiscount', () => {
    it('should delete discount from cache', async () => {
      const flightId = '70de7be1-6b6d-4ec3-8063-be55e241d488'
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const cacheManagerDelSpy = jest.spyOn(cacheManager, 'del')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      await discountService.useDiscount(discountCode, nationalId, flightId)

      expect(cacheManagerDelSpy).toHaveBeenCalledTimes(2)
      expect(cacheManagerSetSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('reactivateDiscount', () => {
    it('should delete discount from cache', async () => {
      const flightId = '70de7be1-6b6d-4ec3-8063-be55e241d488'
      const cacheManagerDelSpy = jest.spyOn(cacheManager, 'del')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      await discountService.reactivateDiscount(flightId)

      expect(cacheManagerDelSpy).toHaveBeenCalledTimes(1)
      expect(cacheManagerSetSpy).toHaveBeenCalledTimes(1)
    })
  })
})
