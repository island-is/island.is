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

  beforeEach(() => {
    mockFetch.mockReset()
    process.env.FORM_SYSTEM_GOOGLE_TRANSLATE_API_KEY = 'test-key'
  })

  it('does not call Google when the texts array exceeds the item cap', async () => {
    const service = new GoogleTranslateService()
    const texts = Array.from(
      { length: GOOGLE_TRANSLATE_MAX_TEXTS_PER_REQUEST + 1 },
      () => 'ok',
    )

    await expect(service.translateTexts(user, texts)).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
