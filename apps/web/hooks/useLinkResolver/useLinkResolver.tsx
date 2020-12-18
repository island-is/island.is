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

export type LinkType = keyof typeof routesTemplate

// the order matters, arrange from most specific to least specific for correct type resolution
export const routesTemplate = {
  aboutsubpage: {
    is: '/stafraent-island/[slug]',
    en: '',
  },
  page: {
    is: '/stafraent-island',
    en: '',
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
  const type = linkType.toLowerCase()

  if (routesTemplate[type] && routesTemplate[type][locale]) {
    const typePath = routesTemplate[type][locale]

    if (slugs.length) {
      // populate path templates with variables
      return {
        href: typePath,
        as: slugs.reduce(
          (asPath, slug) => replaceVariableInPath(asPath, slug),
          typePath,
        ),
      }
    } else {
      // there are no slugs, return found path
      return {
        as: typePath,
        href: typePath,
      }
    }
  } else {
    // we return to the homepage if requested path is not found
    return {
      as: routesTemplate['homepage'][locale],
      href: routesTemplate['homepage'][locale],
    }
  }
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
      // we are skipping all route types that have path variables and all locales that have no path templates
      if ((skipDynamic && routeTemplate.includes('[')) || !routeTemplate) {
        continue
      }

      // handle homepage en path
      if (path === '/en') {
        return { type: 'homepage', locale: 'en' }
      }

      // convert the route template string into a regex query
      const regex = convertToRegex(routeTemplate)
      // if this path matches query return route info else continue
      if (path.match(regex)) {
        return { type, locale } as TypeResolverResponse
      }
    }
  }
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
