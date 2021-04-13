import { Injectable } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import { StaticText } from '@island.is/application/core'
import { createIntl, createIntlCache } from '@formatjs/intl'
import { logger } from '@island.is/logging'

import { TranslationsService } from '../translations.service'

@Injectable()
export class IntlService {
  private namespaces: string[] | undefined = []
  private locale: Locale = 'is'

  constructor(private translationsService: TranslationsService) {}

  intl() {
    const intlCache = createIntlCache()
    const messages = this.getMessages(this.namespaces, this.locale)

    return createIntl({ locale: this.locale, messages }, intlCache)
  }

  /**
   * We reduced all the messages from the different namespaces
   * inside an unique object for the current locale.
   */
  getMessages(namespaces: string[] | undefined, locale: Locale) {
    return namespaces?.reduce((acc, cur) => {
      if (this.translationsService.loadedNamespaces.has(cur)) {
        const namespace = this.translationsService.loadedNamespaces.get(cur)!

        return {
          ...acc,
          ...namespace.find((item) => item.id === locale)!.messages,
        }
      }

      return acc
    }, {})
  }

  setConfig({ namespaces, locale }: { namespaces?: string[]; locale: Locale }) {
    this.namespaces = namespaces
    this.locale = locale
  }

  formatMessage = (descriptor: StaticText): string => {
    if (!descriptor) {
      logger.warn('No descriptor passed to formatMessage function.')
      return ''
    }

    if (typeof descriptor === 'string') {
      return descriptor
    }

    if (!this.namespaces) {
      return descriptor.defaultMessage as string
    }

    return this.intl().formatMessage(descriptor)
  }
}
