import { isObject } from 'util'
import { Translation } from '../i18n/locales'

const locales = {}

export const getLocale = async (locale: string): Promise<Translation> => {
  if (!locales[locale]) {
    try {
      locales[locale] = await import(`../i18n/locales/${locale}.json`)
    } catch (error) {
      console.error(`locale "${locale}" is not available`)
    }
  }
  return locales[locale]
}

export const getRoutefromLocale = async (
  path: string,
  from: string,
  to: string,
) => {
  const fromLocale = await getLocale(from)
  const toLocale = await getLocale(to)
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
  return findPath(fromLocale.routes, toLocale.routes, path)
}
