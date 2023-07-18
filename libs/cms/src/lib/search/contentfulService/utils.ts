import type { Locale } from 'locale'

// Contentful locale does not always reflect the api locale so we need this map
export const contentfulLocaleMap = {
  is: 'is-IS',
  en: 'en',
}

export function removeLocaleKeysFromEntry(
  node: object,
  locale: Locale,
  visited = new Set<object>(),
) {
  if (!node || typeof node !== 'object' || visited.has(node)) return node

  visited.add(node)

  for (const key in node) {
    const value = node[key as keyof typeof node]
    if (typeof value === 'object') {
      ;(node[key as keyof typeof node] as object) = removeLocaleKeysFromEntry(
        value,
        locale,
        visited,
      )
    }
    if (key === contentfulLocaleMap[locale]) {
      return value
    }
  }

  return node
}
