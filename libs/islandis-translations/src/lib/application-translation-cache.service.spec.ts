import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test } from '@nestjs/testing'

import { ApplicationTranslationCacheService } from './application-translation-cache.service'
import { getApplicationTranslationCacheKey } from './application-translation.cache'

describe('getApplicationTranslationCacheKey', () => {
  it('returns the shared runtime cache key for a namespace', () => {
    expect(getApplicationTranslationCacheKey('ApplicationSystem')).toBe(
      'app-translation:ApplicationSystem',
    )
  })
})

describe('ApplicationTranslationCacheService.invalidate', () => {
  it('deletes the namespace cache key from Redis', async () => {
    const delSpy = jest.fn().mockResolvedValue(undefined)

    const module = await Test.createTestingModule({
      providers: [
        ApplicationTranslationCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: { del: delSpy, get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile()

    const service = module.get(ApplicationTranslationCacheService)

    await service.invalidate('ApplicationSystem')

    expect(delSpy).toHaveBeenCalledWith(
      getApplicationTranslationCacheKey('ApplicationSystem'),
    )
  })
})
