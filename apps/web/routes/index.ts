import { LinkReference } from '../graphql/schema'
import { Locale, defaultLanguage } from '../types'

const routes = {
  is: {
    article: '',
    page: 'stofnanir', // quick fix for launch
    category: 'flokkur',
    articlecategory: 'flokkur',
    contentcategory: 'flokkur',
    news: 'frett',
    search: 'leit',
    lifeevent: 'lifsvidburdur',
    lifeeventpage: 'lifsvidburdur',
  },
  en: {
    article: '',
    page: 'organizations',
    category: 'category',
    articlecategory: 'category',
    contentcategory: 'category',
    news: 'news',
    search: 'search',
    lifeevent: 'life-event',
    lifeeventpage: 'life-event',
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
    const pathType = type ? type.trim().toLowerCase() : null
    const typePath =
      pathType && typeof routes[locale][pathType] === 'string'
        ? String(routes[locale][pathType])
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
    console.log(pathType, path)
    return path ? path.replace(/\/\/+/g, '/') : '/'
  }

  const getLinkProps = ({
    type,
    slug = '',
  }: Pick<LinkReference, 'type' | 'slug'>) => {
    if (!type) {
      return null
    }

    return {
      href: makePath(type as PathTypes, '[slug]'),
      as: makePath(type as PathTypes, slug),
    }
  }

  return {
    makePath,
    getLinkProps,
  }
}

export default routeNames
