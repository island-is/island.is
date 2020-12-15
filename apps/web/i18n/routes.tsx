import { Locale, defaultLanguage } from './I18n'

export interface AnchorAttributes
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  as: string
}

export type ContentType =
  | 'article'
  | 'subarticle'
  | 'page'
  | 'category'
  | 'contentcategory'
  | 'articlecategory'
  | 'news'
  | 'search'
  | 'lifeevent'
  | 'lifeeventpage'
  | 'adgerdir'
  | 'adgerdirfrontpage'
  | 'adgerdirpage'
  | 'linkUrl'
  | ''

export const routes: Record<
  Exclude<ContentType, 'linkUrl'>,
  Record<Locale, string>
> = {
  article: {
    is: '/[slug]',
    en: '/en/[slug]',
  },
  subarticle: {
    is: '/[slug]/[slug]',
    en: '/en/[slug]/[slug]',
  },
  page: {
    is: '/stofnanir/[slug]',
    en: '/en/organizations/[slug]',
  },
  category: {
    is: '/flokkur/[slug]',
    en: '/en/category/[slug]',
  },
  articlecategory: {
    is: '/flokkur/[slug]',
    en: '/en/category/[slug]',
  },
  contentcategory: {
    is: '/flokkur/[slug]',
    en: '/en/category/[slug]',
  },
  news: {
    is: '/frett/[slug]',
    en: '/en/news/[slug]',
  },
  search: {
    is: '/leit',
    en: '/en/search',
  },
  lifeevent: {
    is: '/lifsvidburdur/[slug]',
    en: '/en/life-event/[slug]',
  },
  lifeeventpage: {
    is: '/lifsvidburdur/[slug]',
    en: '/en/life-event/[slug]',
  },
  adgerdir: {
    is: '/covid-adgerdir/[slug]',
    en: '/en/covid-operations/[slug]',
  },
  adgerdirfrontpage: {
    is: '/covid-adgerdir',
    en: '/en/covid-operations',
  },
  adgerdirpage: {
    is: '/covid-adgerdir/[slug]',
    en: '/en/covid-operations/[slug]',
  },
  '': {
    is: '/',
    en: '/en',
  },
}

export const replaceSlugInPath = (
  path: string,
  replacement: string,
): string => {
  return path.replace(/\[\w+\]/, replacement)
}

export const removeSlugFromPath = (path: string): string => {
  return path.replace(/\/\[\w+\]/g, '')
}

export const pathNames = (
  locale: Locale = defaultLanguage,
  contentType: ContentType = '',
  slugs?: Array<string>,
): AnchorAttributes => {
  // we just pass link url onward with url as href since it is external, this is handled in island-ui link
  // this allows us to
  if (contentType === 'linkUrl') {
    return {
      as: '',
      href: slugs[0],
    }
  }
  let path: AnchorAttributes = { as: '/', href: '/' }
  const type = String(contentType).toLowerCase()

  if (routes[type]) {
    const typePath: string = routes[type][locale]
    path = { as: typePath, href: typePath }

    if (slugs && slugs.length > 0) {
      for (let i = 0; i < slugs.length; i++) {
        path.as = replaceSlugInPath(path.as, slugs[i])
        if (type === 'page' && slugs[i] === 'stafraent-island') {
          path.href = path.as
        }
      }
    } else {
      path.as = removeSlugFromPath(path.as)
      path.href = removeSlugFromPath(path.href)
    }
    return path
  }
  return path
}

export default pathNames
