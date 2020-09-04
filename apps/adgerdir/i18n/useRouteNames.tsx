import { Locale, defaultLanguage } from './I18n'

const routeNames = {
  is: {
    article: 'grein',
    category: 'flokkur',
    news: 'frettir',
    search: 'leit',
  },
  en: {
    article: 'article',
    category: 'category',
    news: 'news',
    search: 'search',
  },
}

export type pathTypes = 'article' | 'category' | 'news' | 'search'

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

      return path || '/'
    },
  }
}

export default useRouteNames
