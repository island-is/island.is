import { ApplicationConfigurations } from '@island.is/application/types'

/** All Contentful-style namespaces used by application templates (from ApplicationConfigurations). */
export const getApplicationTranslationNamespaceSet = (): Set<string> => {
  const namespaces = new Set<string>()
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
