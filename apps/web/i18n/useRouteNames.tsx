import { Locale, defaultLanguage } from './I18n'

const routeNames = {
  is: {
    article: 'grein',
    category: 'flokkur',
    search: 'leit',
  },
  en: {
    article: 'article',
    category: 'category',
    search: 'search',
  },
}

type pathTypes = 'article' | 'category' | 'search'

const useRouteNames = (locale: Locale = defaultLanguage) => {
  return {
    makePath: (type?: pathTypes, subfix?: string) => {
      let path = ''

      const typePath = (type && routeNames[locale][type]) ?? null

      if (locale && locale !== defaultLanguage) {
        path += '/' + locale
      }

      if (typePath) {
        path += '/' + typePath
      }

      if (subfix) {
        path += '/' + subfix
      }

      return path
    },
  }
}

export default useRouteNames
