import { Injectable } from '@nestjs/common'
import {
  createIntl,
  createIntlCache,
  IntlShape,
  MessageDescriptor,
} from '@formatjs/intl'
import { logger } from '@island.is/logging'
import { Locale } from '@island.is/shared/types'

import { CmsTranslationsService } from './cms-translations.service'
import type { FormatMessage } from '../types'

export type NestIntl = Promise<IntlShape<string>>

export const formatMessage = (intl: IntlShape<string>) =>
  ((
    descriptor: MessageDescriptor | string | undefined,
    values?: Record<string, unknown>,
  ): string | undefined => {
    if (!descriptor || typeof descriptor === 'string') {
      return descriptor
    }

    return intl.formatMessage(descriptor, values)
  }) as FormatMessage

@Injectable()
export class IntlService {
  private intlCache = createIntlCache()

  constructor(private cmsTranslationsService: CmsTranslationsService) {}

  useIntl = async (
    namespaces: string[],
    locale: Locale,
  ): Promise<
    Omit<IntlShape<string>, 'formatMessage'> & {
      formatMessage: FormatMessage
    }
  > => {
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
      formatMessage: formatMessage(intl),
    }
  }
}
