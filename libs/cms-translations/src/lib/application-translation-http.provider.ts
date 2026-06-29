import { Inject, Injectable } from '@nestjs/common'
import {
  FetchError,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import type { Locale } from '@island.is/shared/types'

import type { ApplicationTranslationProvider } from './cms-translations.service'
import { isApplicationTranslationNamespace } from './application-translation.namespaces'
import { APPLICATION_TRANSLATION_HTTP_FETCH } from './application-translation-http.fetch'

export const APPLICATION_TRANSLATION_HTTP_CONFIG =
  'APPLICATION_TRANSLATION_HTTP_CONFIG'

export interface ApplicationTranslationHttpConfig {
  /** Base URL of application-system API (e.g. https://application-system-api or http://localhost:3333) */
  baseUrl: string
}

@Injectable()
export class ApplicationTranslationHttpProvider
  implements ApplicationTranslationProvider
{
  constructor(
    @Inject(APPLICATION_TRANSLATION_HTTP_CONFIG)
    private readonly config: ApplicationTranslationHttpConfig,
    @Inject(APPLICATION_TRANSLATION_HTTP_FETCH)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  isApplicationNamespace(namespace: string): boolean {
    return isApplicationTranslationNamespace(namespace)
  }

  async getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>> {
    const base = this.config.baseUrl.replace(/\/$/, '')
    const encodedNamespace = encodeURIComponent(namespace).replace(/\./g, '%2E')
    const url = `${base}/public/translations/${encodedNamespace}?locale=${encodeURIComponent(
      locale,
    )}`

    try {
      const response = await this.fetch(url)
      return (await response.json()) as Record<string, string>
    } catch (error) {
      if (error instanceof FetchError) {
        const detail =
          typeof error.body === 'string'
            ? error.body.slice(0, 500)
            : error.body
              ? JSON.stringify(error.body).slice(0, 500)
              : ''

        throw new Error(
          `Application translation HTTP ${error.status} ${
            error.statusText
          } for ${url}${detail ? ` — ${detail}` : ''}`,
        )
      }

      const hint =
        this.config.baseUrl.includes('localhost') ||
        this.config.baseUrl.includes('127.0.0.1')
          ? ' Ensure application-system-api is running (dev default: http://localhost:3333).'
          : ''

      throw new Error(
        `Failed to fetch application translations from ${url}: ${
          error instanceof Error ? error.message : String(error)
        }.${hint}`,
      )
    }
  }
}
