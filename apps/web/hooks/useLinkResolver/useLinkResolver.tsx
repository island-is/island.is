import { useContext } from 'react'
import { Locale, I18nContext } from '../../i18n/I18n'

export interface LinkResolverResponse {
  href: string
  as: string
}

interface LinkResolverInput {
  linkType: LinkType
  variables?: string[]
  locale?: Locale
}

interface TypeResolverResponse {
  type: LinkType
  locale: Locale
}

export type LinkType = keyof typeof routesTemplate

/*
The order here matters for type resolution, arrange overlapping types from most specific to least specific for correct type resolution
This should only include one entry for each type
This should only include one instance of a pathTemplate
A locale can be ignored by setting it's value to an empty string
Keys in routesTemplate should ideally match lowercased __typename of graphql api types to allow them to be passed in directly
*/
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

// This considers one block ("[someVar]") to be one variable and ignores the path variables name
const replaceVariableInPath = (path: string, replacement: string): string => {
  return path.replace(/\[\w+\]/, replacement)
}

// converts a path template to a regex query for matching
const convertToRegex = (routeTemplate: string) =>
  routeTemplate
    .replace(/\//g, '\\/') // escape slashes to match literal "/" in route template
    .replace(/\[\w+\]/g, '\\w+') // make path variables be regex word matches

/*
Finds the correct path for a given type and locale.
Returns /404 if no path is found
*/
export const linkResolver = (
  linkType: LinkResolverInput['linkType'],
  variables: LinkResolverInput['variables'] = [],
  locale: LinkResolverInput['locale'],
): LinkResolverResponse => {
  /*
  We lowercase here to allow components to pass unmodified __typename fields
  The __typename fields seem to have case issues, that will be addressed at a later time
  */
  const type = linkType?.toLowerCase() ?? ''

  // We consider path not found if it has no entry in routesTemplate or if the found path is empty
  if (routesTemplate[type] && routesTemplate[type][locale]) {
    const typePath = routesTemplate[type][locale]

    if (variables.length) {
      // populate path templates with variables
      return {
        href: typePath,
        as: variables.reduce(
          (asPath, slug) => replaceVariableInPath(asPath, slug),
          typePath,
        ),
      }
    } else {
      // there are no variables, return path template as path
      return {
        as: typePath,
        href: typePath,
      }
    }
  } else {
    // we return to 404 page if no path is found, if this happens we have a bug
    return {
      as: '/404',
      href: '/404',
    }
  }
}

/*
The type resolver returns a best guess type for a given path
This should be reliable as long as we are able to arrange routesTemplate in a uniquely resolvable order
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
      if (path?.match(regex)) {
        return { type, locale } as TypeResolverResponse
      }
    }
  }
  return null
}

/*
The link resolver hook handles locale automatically
this allows components to be language agnostic
*/
export const useLinkResolver = () => {
  const context = useContext(I18nContext)
  const wrappedLinkResolver = (
    linkType: LinkResolverInput['linkType'],
    variables: LinkResolverInput['variables'] = [],
    locale: LinkResolverInput['locale'] = context.activeLocale,
  ) => linkResolver(linkType, variables, locale)
  return {
    typeResolver,
    linkResolver: wrappedLinkResolver,
  }
}
