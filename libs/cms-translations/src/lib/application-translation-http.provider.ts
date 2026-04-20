import { Inject, Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { Locale } from '@island.is/shared/types'

import type { ApplicationTranslationProvider } from './cms-translations.service'
import { getApplicationTranslationNamespaceSet } from './application-translation.namespaces'

export const APPLICATION_TRANSLATION_HTTP_CONFIG = 'APPLICATION_TRANSLATION_HTTP_CONFIG'

export interface ApplicationTranslationHttpConfig {
  /** Base URL of application-system API (e.g. https://application-system-api or http://localhost:3333) */
  baseUrl: string
}

const applicationNamespaces = getApplicationTranslationNamespaceSet()

@Injectable()
export class ApplicationTranslationHttpProvider
  implements ApplicationTranslationProvider
{
  constructor(
    @Inject(APPLICATION_TRANSLATION_HTTP_CONFIG)
    private readonly config: ApplicationTranslationHttpConfig,
  ) {}

  isApplicationNamespace(namespace: string): boolean {
    return applicationNamespaces.has(namespace)
  }

  async getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>> {
    const base = this.config.baseUrl.replace(/\/$/, '')
    const url = `${base}/public/translations/${encodeURIComponent(
      namespace,
    )}?locale=${encodeURIComponent(locale)}`

    let response: Response
    try {
      response = await fetch(url)
    } catch (err) {
      logger.error(err)
      throw new Error(
        `Failed to fetch application translations from ${url}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      )
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(
        `Application translation HTTP ${response.status} ${response.statusText} for ${url}${text ? ` — ${text.slice(0, 500)}` : ''}`,
      )
    }

    return (await response.json()) as Record<string, string>
  }
}
