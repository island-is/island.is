import { Locale, defaultLanguage } from './I18n'

const routes = {
  is: {
    article: '',
    Article: '',
    category: 'flokkur',
    ArticleCategory: 'flokkur',
    ContentCategory: 'flokkur',
    news: 'frett',
    News: 'frett',
    search: 'leit',
    lifeEvent: 'lifsvidburdur',
    LifeEventPage: 'lifsvidburdur',
  },
  en: {
    article: '',
    Article: '',
    category: 'category',
    ArticleCategory: 'category',
    ContentCategory: 'category',
    news: 'news',
    News: 'news',
    search: 'search',
    lifeEvent: 'life-event',
    LifeEventPage: 'life-event',
  },
}

export type PathTypes =
  | 'article'
  | 'Article'
  | 'category'
  | 'ContentCategory'
  | 'ArticleCategory'
  | 'news'
  | 'News'
  | 'search'
  | 'lifeEvent'
  | 'LifeEventPage'

export const routeNames = (locale: Locale = defaultLanguage) => {
  return {
    makePath: (type?: PathTypes, subfix?: string) => {
      let path = ''

      const typePath = (type && routes[locale][type]) ?? null

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

export default routeNames
