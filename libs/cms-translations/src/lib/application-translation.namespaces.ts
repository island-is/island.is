import { ApplicationConfigurations } from '@island.is/application/types'

export const CORE_TRANSLATION_NAMESPACE = 'application.system'

/** All Contentful-style namespaces used by application templates (from ApplicationConfigurations). */
export const getApplicationTranslationNamespaceSet = (): Set<string> => {
  const namespaces = new Set<string>([CORE_TRANSLATION_NAMESPACE])
  for (const config of Object.values(ApplicationConfigurations)) {
    const ns = Array.isArray(config.translation)
      ? config.translation
      : [config.translation]
    for (const n of ns) {
      namespaces.add(n)
    }
  }
  return namespaces
}
