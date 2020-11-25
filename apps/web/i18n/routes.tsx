import { Locale, defaultLanguage } from './I18n'

export interface AnchorAttributes
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  as: string
}

export type ContentType =
  | 'article'
  | 'page'
  | 'category'
  | 'contentcategory'
  | 'articlecategory'
  | 'news'
  | 'search'
  | 'lifeevent'
  | 'lifeeventpage'
  | 'adgerdir'
  | 'vidspyrna-frontpage'

export const routes: Record<ContentType, Record<Locale, AnchorAttributes>> = {
  article: {
    is: { as: '/[slug]', href: '/[slug]' },
    en: { as: '/en/[slug]', href: '/en/[slug]' },
  },
  page: {
    is: { as: '/stofnanir/[slug]', href: '/stofnanir/stafraent-island' }, // TODO FOLDER STRUCTURE NEEDS FIXING
    en: {
      as: '/en/organizations/[slug]',
      href: '/en/organizations/stafraent-island',
    },
  },
  category: {
    is: { as: '/flokkur/[slug]', href: '/flokkur/[slug]' },
    en: { as: '/en/category/[slug]', href: '/en/category/[slug]' },
  },
  articlecategory: {
    is: { as: '/flokkur/[slug]', href: '/flokkur/[slug]' },
    en: { as: '/en/category/[slug]', href: '/en/category/[slug]' },
  },
  contentcategory: {
    is: { as: '/flokkur/[slug]', href: '/flokkur/[slug]' },
    en: { as: '/en/category/[slug]', href: '/en/category/[slug]' },
  },
  news: {
    is: { as: '/frett/[slug]', href: '/frett/[slug]' },
    en: { as: '/en/news/[slug]', href: '/en/news/[slug]' },
  },
  search: {
    is: { as: '/leit/[slug]', href: '/leit/[slug]' },
    en: { as: '/en/search/[slug]', href: '/en/search/[slug]' },
  },
  lifeevent: {
    is: { as: '/lifsvidburdur/[slug]', href: '/lifsvidburdur/[slug]' },
    en: { as: '/en/life-event/[slug]', href: '/en/life-event/[slug]' },
  },
  lifeeventpage: {
    is: { as: '/lifsvidburdur/[slug]', href: '/lifsvidburdur/[slug]' },
    en: { as: '/en/life-event/[slug]', href: '/en/life-event/[slug]' },
  },
  adgerdir: {
    is: { as: '/covid-adgerdir/[slug]', href: '/covid-adgerdir/[slug]' },
    en: {
      as: '/en/covid-operations/[slug]',
      href: '/en/covid-operations/[slug]',
    },
  },
  'vidspyrna-frontpage': {
    is: { as: '/covid-adgerdir/[slug]', href: '/covid-adgerdir/[slug]' },
    en: {
      as: '/en/covid-operations/[slug]',
      href: '/en/covid-operations/[slug]',
    },
  },
}

const removeSlugFromString = (path: string): string => {
  return path.replace('/[slug]', '')
}

export const pathNames = (
  locale: Locale = defaultLanguage,
  type: ContentType,
  slugs?: Array<string>,
): AnchorAttributes => {
  const typePath = routes[type.toLowerCase()][locale]
  const path: AnchorAttributes = typePath

  if (type === 'vidspyrna-frontpage') {
    path.as = removeSlugFromString(path.as)
    path.href = removeSlugFromString(path.href)
    return path
  }

  if (slugs && slugs.length > 0) {
    for (let i = 0; i < slugs.length; i++) {
      path.as = String(typePath.as).replace('[slug]', slugs[i])
      path.href = String(typePath.href)
    }
  } else {
    path.as = removeSlugFromString(path.as)
    path.href = removeSlugFromString(path.href)
  }

  return path
}

export default pathNames
