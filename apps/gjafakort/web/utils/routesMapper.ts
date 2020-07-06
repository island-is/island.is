import { isObject } from 'util'

const locales = {}

const getLocale = async (locale) => {
  if (!locales[locale]) {
    try {
      locales[locale] = await import(`../i18n/locales/${locale}.json`)
    } catch (error) {
      throw new Error(`locale "${locale}" is not available`)
    }
  }
}

export const getRoutefromLocale = async (
  path: string,
  from: string,
  to: string,
) => {
  await getLocale(from)
  await getLocale(to)
  const findPath = (baseObj, returnObj, path) => {
    return Object.keys(baseObj).reduce((acc, key) => {
      if (baseObj[key] === path) {
        return returnObj[key]
      }
      if (isObject(baseObj[key])) {
        const nestedPath = findPath(baseObj[key], returnObj[key], path)
        if (nestedPath) {
          return nestedPath
        }
      }
      return acc
    }, '')
  }
  return findPath(locales[from], locales[to], path)
}
