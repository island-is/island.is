const mockFetch = jest.fn()

jest.mock('@island.is/clients/middlewares', () => ({
  createEnhancedFetch: () => mockFetch,
}))

import { BadRequestException } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'

import { GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST } from './google-translate.limits'
import { GoogleTranslateService } from './google-translate.service'

describe('GoogleTranslateService', () => {
  const user: User = {
    nationalId: '0101302989',
    scope: [],
    authorization: '',
    client: 'test',
  }

  const config = {
    apiKey: 'test-key',
    apiUrl: 'https://translation.googleapis.com/language/translate/v2',
    isConfigured: true,
  }

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('does not call Google when the texts array exceeds the item cap', async () => {
    const service = new GoogleTranslateService(config)
    const texts = Array.from(
      { length: GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST + 1 },
      () => 'ok',
    )

    await expect(service.translateTexts(user, texts)).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns empty translations without calling Google when no apiKey is configured', async () => {
    const service = new GoogleTranslateService({ ...config, apiKey: undefined })

    const result = await service.translateTexts(user, ['hallo'])

    expect(result).toEqual([''])
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('calls Google at the configured apiUrl', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { translations: [{ translatedText: 'hello' }] },
      }),
    })
    const service = new GoogleTranslateService(config)

    const result = await service.translateTexts(user, ['hallo'])

    expect(result).toEqual(['hello'])
    expect(mockFetch).toHaveBeenCalledWith(
      config.apiUrl,
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
