export const CORE_TRANSLATION_NAMESPACE = 'application.system'

/** Namespaces that do not follow the `*.application` convention. */
const APPLICATION_TRANSLATION_NAMESPACE_EXCEPTIONS = new Set(['vmst.cjs'])

/**
 * Lightweight check for application translation namespaces without importing
 * ApplicationConfigurations (and its heavy template/UI dependency graph).
 */
export const isApplicationTranslationNamespace = (
  namespace: string,
): boolean =>
  namespace === CORE_TRANSLATION_NAMESPACE ||
  namespace.endsWith('.application') ||
  APPLICATION_TRANSLATION_NAMESPACE_EXCEPTIONS.has(namespace)
