import type { Locale } from '@island.is/shared/types'

export const APPLICATION_TRANSLATION_PROVIDER =
  'APPLICATION_TRANSLATION_PROVIDER'

export type ApplicationNamespaceTranslations = Record<
  Locale,
  Record<string, string>
>

export interface ApplicationTranslationProvider {
  getTranslationsForNamespace(
    namespace: string,
    locale: Locale,
  ): Promise<Record<string, string>>
  getTranslationsForAllLocales(
    namespace: string,
  ): Promise<ApplicationNamespaceTranslations>
  isApplicationNamespace(namespace: string): boolean
}
