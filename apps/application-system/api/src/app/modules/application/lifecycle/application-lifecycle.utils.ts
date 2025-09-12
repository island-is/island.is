import { getValueViaPath } from '@island.is/application/core'
import { RecordObject } from '@island.is/application/types'

export const DEFAULT_POST_PRUNE_DELAY = 365 * 24 * 3600 * 1000

/**
 * Sets a value in an object at the given dot-notated path.
 * Creates nested objects if they do not exist.
 *
 * Example:
 *   setValueViaPath(obj, 'a.b.c', 123)
 *
 * @param obj The target object
 * @param path Dot-notated path (e.g., "a.b.c")
 * @param value The value to set
 */
const setValueViaPath = (obj: RecordObject, path: string, value: unknown) => {
  const keys = path.split('.')
  keys.reduce<RecordObject>((acc, key, i) => {
    if (i === keys.length - 1) {
      acc[key] = value
    } else {
      if (typeof acc[key] !== 'object' || acc[key] === null) {
        acc[key] = {}
      }
      return acc[key] as RecordObject
    }
    return acc
  }, obj)
}

/**
 * Converts objects with numeric keys (0, 1, 2, ...) into arrays.
 * Only handles one level deep (non-recursive).
 */
const normalizeArrays = (obj: RecordObject): RecordObject => {
  const result: RecordObject = {}

  for (const [key, value] of Object.entries(obj)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).every((k) => /^\d+$/.test(k))
    ) {
      // Convert numeric-key object into array
      const arr: unknown[] = []
      Object.entries(value)
        .sort(([a], [b]) => Number(a) - Number(b))
        .forEach(([, v]) => arr.push(v))
      result[key] = arr
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Expands keys containing the '.$.' wildcard into explicit index-based paths.
 * Useful when retaining only specific fields from arrays.
 * Only handles one level of wildcard; nested wildcards are not expanded.
 *
 * Example:
 *   fieldKeys = ['items.$.name']
 *   result = ['items.0.name', 'items.1.name', ...]
 *
 * @param source Source object used to determine array length
 * @param fieldKeys Array of keys that may contain '.$.'
 * @returns Expanded array of keys without wildcards
 */
export const expandFieldKeys = (
  source: RecordObject,
  fieldKeys: string[],
): string[] => {
  const expandedKeys: string[] = []

  for (const key of fieldKeys) {
    const wildcardCount = (key.match(/\.\$\./g) || []).length

    if (wildcardCount > 1) {
      throw new Error(`Key "${key}" contains more than one '$' wildcard`)
    }

    if (key.startsWith('$.')) {
      throw new Error(`Key "${key}" cannot start with '$.'`)
    }

    if (key.includes('.$.')) {
      const [prefix, ...suffixParts] = key.split('.$.')
      const arrayValue = getValueViaPath(source, prefix)

      if (!Array.isArray(arrayValue)) {
        throw new Error(
          `Expected array at path "${prefix}" for key "${key}", got ${typeof arrayValue}`,
        )
      }

      arrayValue.forEach((_, index) => {
        expandedKeys.push(`${prefix}.${index}.${suffixParts.join('.')}`)
      })
    } else {
      expandedKeys.push(key)
    }
  }

  return expandedKeys
}

/**
 * Builds a pruned object that contains only the keys specified in fieldKeys.
 * Supports '.$.' wildcard for arrays.
 *
 * Example:
 *   source = { items: [{ name: 'A', other: 'lorem' }, { name: 'B', other: 'ipsum' }] }
 *   fieldKeys = ['items.$.name']
 *   result = { items: [{ name: 'A' }, { name: 'B' }] }
 *
 * @param source The original object (answers or externalData)
 * @param fieldKeys List of paths to retain (may include '.$.')
 * @returns A new object with only the specified keys
 */
export const getAdminDataForPruning = (
  source: RecordObject,
  fieldKeys: string[],
): RecordObject => {
  const expandedKeys = expandFieldKeys(source, fieldKeys)
  const result: RecordObject = {}

  for (const key of expandedKeys) {
    const value = getValueViaPath(source, key)
    if (value !== undefined) {
      setValueViaPath(result, key, value)
    }
  }

  return normalizeArrays(result)
}
