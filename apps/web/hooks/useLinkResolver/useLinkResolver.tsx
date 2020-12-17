import { useContext } from 'react'
import { Locale, I18nContext } from '../../i18n/I18n'

export interface LinkResolverResponse {
  href: string
  as: string
}

interface LinkResolverInput {
  linkType: LinkType
  slugs?: string[]
  locale?: Locale
}

interface TypeResolverResponse {
  type: LinkType
  locale: Locale
}

interface RoutesTemplate {
  [linkType: string]: {
    is: string
    en: string
  }
}

export type LinkType = keyof typeof routesTemplate

// the order matters, arrange from most specific to least specific for correct type resolution
export const routesTemplate: RoutesTemplate = {
  aboutsubpage: {
    is: '/stofnanir/stafraent-island/[slug]',
    en: '/en/organizations/stafraent-island/[slug]',
  },
  page: {
    is: '/stofnanir/stafraent-island',
    en: '/en/organizations/stafraent-island',
  },
  search: {
    is: '/leit',
    en: '/en/search',
  },
  articlecategory: {
    is: '/flokkur/[slug]',
    en: '/en/category/[slug]',
  },
  news: {
    is: '/frett/[slug]',
    en: '/en/news/[slug]',
  },
  newsoverview: {
    is: '/frett',
    en: '/en/news',
  },
  lifeeventpage: {
    is: '/lifsvidburdur/[slug]',
    en: '/en/life-event/[slug]',
  },
  adgerdirpage: {
    is: '/covid-adgerdir/[slug]',
    en: '/en/covid-operations/[slug]',
  },
  adgerdirfrontpage: {
    is: '/covid-adgerdir',
    en: '/en/covid-operations',
  },
  subarticle: {
    is: '/[slug]/[subSlug]',
    en: '/en/[slug]/[subSlug]',
  },
  article: {
    is: '/[slug]',
    en: '/en/[slug]',
  },
  linkurl: {
    is: '[slug]',
    en: '[slug]',
  },
  homepage: {
    is: '/',
    en: '/en',
  },
}

const replaceVariableInPath = (path: string, replacement: string): string => {
  return path.replace(/\[\w+\]/, replacement)
}

const removeVariableFromPath = (path: string): string => {
  return path.replace(/\/\[\w+\]/g, '')
}

// returns a regex query for a given route template
const convertToRegex = (routeTemplate: string) =>
  routeTemplate
    .replace(/\//g, '\\/') // escape slashes to match literal "/" in route template
    .replace(/\[\w+\]/g, '\\w+') // make path variables be regex word matches

// tries to return url for given type
export const linkResolver = (
  linkType: LinkResolverInput['linkType'],
  slugs: LinkResolverInput['slugs'] = [],
  locale: LinkResolverInput['locale'],
): LinkResolverResponse => {
  let path = { as: '/', href: '/' }
  const type = String(linkType).toLowerCase()

  if (routesTemplate[type]) {
    const typePath: string = routesTemplate[type][locale]
    path = { as: typePath, href: typePath }

    if (slugs && slugs.length > 0) {
      for (let i = 0; i < slugs.length; i++) {
        path.as = replaceVariableInPath(path.as, slugs[i])
      }
    } else {
      path.as = removeVariableFromPath(path.as)
      path.href = removeVariableFromPath(path.href)
    }
    return path
  }
  return path
}

/*
tries to return type for given path
*/
export const typeResolver = (
  path: string,
  skipDynamic = false,
): TypeResolverResponse | null => {
  for (const [type, locales] of Object.entries(routesTemplate)) {
    for (const [locale, routeTemplate] of Object.entries(locales)) {
      // we are skipping all route types that have path variables
      if (skipDynamic && routeTemplate.includes('[')) {
        continue
      }

      // handle homepage en path
      if (path === '/en') {
        return { type: 'homepage', locale: 'en' }
      }

      // convert the route template string into a regex query
      const regex = convertToRegex(routeTemplate)
      console.log('-----------')
      console.log('testing', path)
      console.log('with', regex)
      // if this path matches query return route info else continue
      if (path.match(regex)) {
        console.log('found type', type, locale)
        return { type, locale } as TypeResolverResponse
      }
    }
  }
  console.log('returning null')
  return null
}

export const useLinkResolver = () => {
  const context = useContext(I18nContext)
  const wrappedLinkResolver = (
    linkType: LinkResolverInput['linkType'],
    slugs: LinkResolverInput['slugs'] = [],
    locale: LinkResolverInput['locale'] = context.activeLocale,
  ) => linkResolver(linkType, slugs, locale)
  return {
    typeResolver,
    linkResolver: wrappedLinkResolver,
  }
}

// TODO: Remove stafraent-island as root path (currentli stafraent island page are not reolve-ing correct types due to them beeing root)
// TODO: Add redirect for root stafraent-island
// TODO: Handle english routes for page and aboutsubpage
