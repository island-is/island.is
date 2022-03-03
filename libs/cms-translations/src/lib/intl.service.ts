import { Injectable } from '@nestjs/common'
import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl'

import { StaticText } from '@island.is/application/core'
import { logger } from '@island.is/logging'
import { Locale } from '@island.is/shared/types'

import { CmsTranslationsService } from './cms-translations.service'

export type NestIntl = Promise<IntlShape<string>>

@Injectable()
export class IntlService {
  private intlCache = createIntlCache()

  constructor(private cmsTranslationsService: CmsTranslationsService) {}

  useIntl = async (namespaces: string[], locale: Locale) => {
    const messages = await this.cmsTranslationsService.getTranslations(
      namespaces,
      locale,
    )
    const intl = createIntl(
      {
        locale,
        messages,
        onError: (err) => {
          if (err.code === 'MISSING_TRANSLATION') {
            if (process.env.NODE_ENV !== 'test') {
              logger.warn({ message: err.message })
            }
            return
          }

          throw err
        },
      },
      this.intlCache,
    )

    return {
      ...intl,
      formatMessage: (descriptor: StaticText, values?: any) => {
        if (!descriptor) {
          logger.warn('No descriptor passed to formatMessage function.')
          return ''
        }

        if (typeof descriptor === 'string') {
          return descriptor
        }

        return intl.formatMessage(descriptor, values)
      },
    }
  }
}
