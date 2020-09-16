import { Locale, defaultLanguage } from './I18n'

const routeNames = {
  is: {
    article: 'grein',
    ArticleCategory: 'flokkur',
    ContentCategory: 'flokkur',
    news: 'frett',
    search: 'leit',
    landingPage: '',
    lifeEvent: 'lifsvidburdur',
    page: '',
  },
  en: {
    article: 'article',
    ArticleCategory: 'category',
    ContentCategory: 'category',
    news: 'news',
    search: 'search',
    landingPage: '',
    lifeEvent: 'life-event',
    page: '',
  },
}

export type PathTypes =
  | 'article'
  | 'ArticleCategory'
  | 'ContentCategory'
  | 'news'
  | 'search'
  | 'landingPage'
  | 'page'
  | 'lifeEvent'

export const useRouteNames = (locale: Locale = defaultLanguage) => {
  return {
    makePath: (type?: PathTypes, subfix?: string) => {
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
