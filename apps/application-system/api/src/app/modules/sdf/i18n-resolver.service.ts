import { Injectable } from '@nestjs/common'
import { IntlService } from '@island.is/cms-translations'
import { getApplicationTranslationNamespaces } from '@island.is/application/template-loader'
import {
  Application,
  FormText,
  FormTextWithLocale,
  StaticText,
} from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import type { FormatMessage } from '@island.is/application/types'
import type { Locale } from '@island.is/shared/types'

@Injectable()
export class I18nResolverService {
  constructor(private readonly intlService: IntlService) {}

  async createResolver(
    application: Application,
    locale: Locale,
  ): Promise<FormTextResolver> {
    const namespaces = await getApplicationTranslationNamespaces(application)
    const intl = await this.intlService.useIntl(namespaces, locale)
    return new FormTextResolver(application, intl.formatMessage, locale)
  }
}

export class FormTextResolver {
  constructor(
    private readonly application: Application,
    private readonly formatMessage: FormatMessage,
    private readonly locale: Locale,
  ) {}

  get currentLocale(): Locale {
    return this.locale
  }

  /**
   * Exposes the underlying `formatMessage` for helpers that resolve names
   * directly (e.g. `getApplicationNameTranslationString`, which supports the
   * dynamic `name(application)` form with interpolated values).
   */
  get format(): FormatMessage {
    return this.formatMessage
  }

  resolve(
    text: FormText | FormTextWithLocale | StaticText | undefined,
  ): string {
    if (text === undefined || text === null) return ''
    if (typeof text === 'string') return text
    if (typeof text === 'function') {
      const result = (text as Function)(
        this.application,
        this.locale,
        this.formatMessage,
      )
      if (result === undefined || result === null) return ''
      if (typeof result === 'string') return result
      const resolved = formatText(result, this.application, this.formatMessage)
      return Array.isArray(resolved) ? resolved.join('') : (resolved ?? '')
    }
    const resolved = formatText(text as any, this.application, this.formatMessage)
    return Array.isArray(resolved) ? resolved.join('') : (resolved ?? '')
  }
}
