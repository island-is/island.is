import { Inject, Injectable } from '@nestjs/common'
import {
  FetchError,
  type EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'
import type { Locale } from '@island.is/shared/types'

import type {
  ApplicationNamespaceTranslations,
  ApplicationTranslationProvider,
} from './application-translation.provider'
import { isApplicationTranslationNamespace } from './application-translation.namespaces'
import { APPLICATION_TRANSLATION_HTTP_FETCH } from './application-translation-http.fetch'
import { ApplicationTranslationHttpConfig } from './application-translation-http.config'

@Injectable()
export class ApplicationTranslationHttpProvider
  implements ApplicationTranslationProvider
{
  constructor(
    @Inject(ApplicationTranslationHttpConfig.KEY)
    private readonly config: ConfigType<typeof ApplicationTranslationHttpConfig>,
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
    const url = `${this.namespaceUrl(namespace)}?locale=${encodeURIComponent(
      locale,
    )}`
    return this.fetchJson(url)
  }

  async getTranslationsForAllLocales(
    namespace: string,
  ): Promise<ApplicationNamespaceTranslations> {
    return this.fetchJson(`${this.namespaceUrl(namespace)}/locales`)
  }

  private namespaceUrl(namespace: string): string {
    const base = this.config.baseApiUrl.replace(/\/$/, '')
    const encodedNamespace = encodeURIComponent(namespace).replace(/\./g, '%2E')
    return `${base}/public/translations/${encodedNamespace}`
  }

  private async fetchJson<T>(url: string): Promise<T> {
    try {
      const response = await this.fetch(url)
      return (await response.json()) as T
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
        this.config.baseApiUrl.includes('localhost') ||
        this.config.baseApiUrl.includes('127.0.0.1')
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
