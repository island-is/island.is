import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test } from '@nestjs/testing'

import { CmsTranslationsService } from './cms-translations.service'
import { CmsTranslationConfig } from './cms-translations.config'
import { getApplicationTranslationCacheKey } from './application-translation.cache'
import { ContentfulRepository } from '@island.is/cms'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

describe('getApplicationTranslationCacheKey', () => {
  it('returns the shared runtime cache key for a namespace', () => {
    expect(getApplicationTranslationCacheKey('ApplicationSystem')).toBe(
      'app-translation:ApplicationSystem',
    )
  })
})

describe('CmsTranslationsService.invalidateApplicationTranslationCache', () => {
  it('deletes the namespace cache key from Redis', async () => {
    const delSpy = jest.fn().mockResolvedValue(undefined)

    const module = await Test.createTestingModule({
      providers: [
        CmsTranslationsService,
        {
          provide: ContentfulRepository,
          useValue: {},
        },
        {
          provide: CmsTranslationConfig.KEY,
          useValue: { memCacheExpiryMilliseconds: 900000 },
        },
        {
          provide: CACHE_MANAGER,
          useValue: { del: delSpy, get: jest.fn(), set: jest.fn() },
        },
        {
          provide: FeatureFlagService,
          useValue: { getValue: jest.fn() },
        },
      ],
    }).compile()

    const service = module.get(CmsTranslationsService)

    await service.invalidateApplicationTranslationCache('ApplicationSystem')

    expect(delSpy).toHaveBeenCalledWith(
      getApplicationTranslationCacheKey('ApplicationSystem'),
    )
  })
})
