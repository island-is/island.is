import { ExecutionContext, Injectable } from '@nestjs/common'
import { Locale } from '@island.is/auth-nest-tools'

// Use the same formatMessage as react-intl

@Injectable()
export class TranslationsService {
  constructor() {}

  public formatMessage(key: string, locale: Locale): string {
    if (locale === 'en') {
      return `${key} in english`
    }

    return `${key} í inslensku`
  }
}
