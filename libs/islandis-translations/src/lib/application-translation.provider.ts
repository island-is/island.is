import type { Locale } from '@island.is/shared/types'

export const APPLICATION_TRANSLATION_PROVIDER =
  'APPLICATION_TRANSLATION_PROVIDER'

export interface ApplicationTranslationProvider {
  getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>>
  isApplicationNamespace(namespace: string): boolean
}
