import { Injectable } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import { StaticText } from '@island.is/application/core'
import { createIntl, createIntlCache } from '@formatjs/intl'
import { logger } from '@island.is/logging'

import { TranslationsService } from '../translations.service'

@Injectable()
export class IntlService {
  constructor(private translationsService: TranslationsService) {}

  getMessages(id: string, locale: Locale) {
    if (this.translationsService.loadedNamespaces.has(id)) {
      const namespace = this.translationsService.loadedNamespaces.get(id)!

      return namespace.data.find((item) => item.id === locale)!.messages
    }

    return {}
  }

  intl = (namespace: string, locale: Locale) => {
    const intlCache = createIntlCache()
    const messages = this.getMessages(namespace, locale)

    return createIntl({ locale, messages }, intlCache)
  }

  formatMessage = (
    key: StaticText | undefined,
    { namespace, locale }: { namespace?: string; locale: Locale },
  ): string | null => {
    if (!key) {
      logger.error('No key passed to formatMessage function.')

      return null
    }

    if (typeof key === 'string') {
      return key
    }

    if (!namespace) {
      return key.defaultMessage as string
    }

    return this.intl(namespace, locale).formatMessage(key)
  }
}
