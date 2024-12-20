import { Translation } from './translation'
import is from './is.json'
import en from './en.json'

const DEFAULT_TRANSLATION = is
const TRANSLATIONS = [is, en]

const isObject = (obj: any) => {
  return typeof obj === 'object' && obj !== null
}

const isArray = (arr: any) => {
  return Array.isArray(arr)
}

const isNumber = (n: any) => {
  return !isNaN(Number(n))
}

const getObjectPrefix = (prefix: string, el: string): string => {
  if (isNumber(el)) {
    return `${prefix}[${el}]`
  }

  if (prefix) {
    return `${prefix}.${el}`
  }
  return el
}

xdescribe('Locales tests', () => {
  it('should contain the same keys for all translations', () => {
    const getKeys: any = (obj: any, prefix = '') => {
      if (!isObject(obj) && !isArray(obj)) {
        return prefix
      }

      return Object.keys(obj).reduce((res: any, el) => {
        if (isArray(obj[el])) {
          return [...res, ...getKeys(obj[el], getObjectPrefix(prefix, el))]
        } else if (isObject(obj[el])) {
          return [...res, ...getKeys(obj[el], getObjectPrefix(prefix, el))]
        } else {
          return [...res, getObjectPrefix(prefix, el)]
        }
      }, [])
    }

    const defaultKeys = getKeys(DEFAULT_TRANSLATION)

    TRANSLATIONS.filter((t) => t !== DEFAULT_TRANSLATION).forEach((t) => {
      expect(getKeys(t)).toEqual(defaultKeys)
    })
  })
  it('should pass typechecking for all translations', () => {
    TRANSLATIONS.forEach((t) => {
      const asTranslation = t as Translation
      expect(asTranslation).not.toBeNull()
    })
  })
})
