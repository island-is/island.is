import { Locale, defaultLanguage } from './I18n'

const routes = {
  is: {
    article: '',
    Article: '',
    page: 'stofnanir', // quick fix for launch
    Page: 'stofnanir',
    category: 'flokkur',
    articleCategory: 'flokkur',
    ArticleCategory: 'flokkur',
    contentCategory: 'flokkur',
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
    page: 'organizations',
    Page: 'organizations',
    category: 'category',
    articleCategory: 'category',
    ArticleCategory: 'category',
    contentCategory: 'category',
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
  | 'contentCategory'
  | 'ContentCategory'
  | 'articleCategory'
  | 'ArticleCategory'
  | 'news'
  | 'News'
  | 'search'
  | 'lifeEvent'
  | 'LifeEventPage'

export const routeNames = (locale: Locale = defaultLanguage) => {
  const makePath = (type?: PathTypes, subfix?: string) => {
    const typePath =
      type && typeof routes[locale][type] === 'string'
        ? String(routes[locale][type])
        : null

    let path = ''

    if (locale !== defaultLanguage) {
      path = '/' + locale
    }

    if (typePath && typePath !== '') {
      path += '/' + typePath
    }

    if (subfix) {
      path += '/' + subfix
    }

    return path ? path.replace(/\/\/+/g, '/') : '/'
  }

  return {
    makePath,
  }
}

export default routeNames
