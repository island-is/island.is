import { useContext } from 'react'
import { defaultLanguage } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import { I18nContext } from '../../i18n/I18n'

export interface LinkResolverResponse {
  href: string
}

interface LinkResolverInput {
  linkType: LinkType
  variables?: string[]
  locale?: Locale
}

interface TypeResolverResponse {
  locale: Locale
  type?: LinkType
  slug?: string[]
}

export type LinkType = keyof typeof routesTemplate | 'linkurl' | 'link'

/*
The order here matters for type resolution, arrange overlapping types from most specific to least specific for correct type resolution
This should only include one entry for each type
This should only include one instance of a pathTemplate
A locale can be ignored by setting it's value to an empty string
Keys in routesTemplate should ideally match lowercased __typename of graphql api types to allow them to be passed directly to the link resolver
*/
export const routesTemplate = {
  aboutsubpage: {
    is: '/s/stafraent-island/[slug]',
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
  organizationservices: {
    is: '/s/[slug]/thjonusta',
    en: '/en/o/[slug]/services',
  },
  auctions: {
    is: '/s/syslumenn/uppbod',
    en: '',
  },
  apicataloguedetailpage: {
    is: '/s/stafraent-island/vefthjonustur/[slug]',
    en: '',
  },
  apicataloguepage: {
    is: '/s/stafraent-island/vefthjonustur',
    en: '',
  },
  organizationsubpage: {
    is: '/s/[slug]/[subSlug]',
    en: '/en/o/[slug]/[subSlug]',
  },
  organizationpage: {
    is: '/s/[slug]',
    en: '/en/o/[slug]',
  },
  organizations: {
    is: '/s',
    en: '/en/o',
  },
  opendatapage: {
    is: '/gagnatorg',
    en: '/en/gagnatorg',
  },
  opendatasubpage: {
    is: '/gagnatorg/[slug]',
    en: '/en/gagnatorg/[slug]',
  },
  projectsubpage: {
    is: '/v/[slug]/[subSlug]',
    en: '/en/p/[slug]/[subSlug]',
  },
  projectpage: {
    is: '/v/[slug]',
    en: '/en/p/[slug]',
  },
  lifeevents: {
    is: '/lifsvidburdir',
    en: '/en/life-events',
  },
  lifeeventpage: {
    is: '/lifsvidburdir/[slug]',
    en: '/en/life-events/[slug]',
  },
  organizationnews: {
    is: '/s/[organization]/frett/[slug]',
    en: '/en/o/[organization]/news/[slug]',
  },
  organizationnewsoverview: {
    is: '/s/[organization]/frett',
    en: '/en/o/[organization]/news',
  },
  adgerdirpage: {
    is: '/covid-adgerdir/[slug]',
    en: '/en/covid-operations/[slug]',
  },
  adgerdirfrontpage: {
    is: '/covid-adgerdir',
    en: '/en/covid-operations',
  },
  regulation: {
    is: '/reglugerdir/nr/[number]',
    en: '',
  },
  regulationshome: {
    is: '/reglugerdir',
    en: '',
  },
  login: {
    is: '/innskraning',
    en: '/en/login',
  },
  webservicedetailpage: {
    is: '/throun/vefthjonustur/[slug]',
    en: '/en/developers/webservices/[slug]',
  },
  webservicespage: {
    is: '/throun/vefthjonustur',
    en: '/en/developers/webservices',
  },
  handbookpage: {
    is: '/throun/handbok',
    en: '/en/developers/handbook',
  },
  developerspage: {
    is: '/throun',
    en: '/en/developers',
  },
  subarticle: {
    is: '/[slug]/[subSlug]',
    en: '/en/[slug]/[subSlug]',
  },
  article: {
    is: '/[slug]',
    en: '/en/[slug]',
  },
  helpdesk: {
    is: '/thjonustuvefur',
    en: '/en/helpdesk',
  },
  helpdeskcategory: {
    is: '/thjonustuvefur/[organizationSlug]/[categorySlug]',
    en: '/en/helpdesk/[organizationSlug]/[categorySlug]',
  },
  helpdesksearch: {
    is: '/thjonustuvefur/leit',
    en: '/en/helpdesk/search',
  },
  homepage: {
    is: '/',
    en: '/en',
  },
}

// This considers one block ("[someVar]") to be one variable and ignores the path variables name
export const replaceVariableInPath = (
  path: string,
  replacement: string,
): string => {
  return path.replace(/\[\w+\]/, replacement)
}

// converts a path template to a regex query for matching
export const convertToRegex = (routeTemplate: string) => {
  const query = routeTemplate
    .replace(/\//g, '\\/') // escape slashes to match literal "/" in route template
    .replace(/\[\w+\]/g, '[-\\w]+') // make path variables be regex word matches
  return `^${query}$` // to prevent partial matches
}

// extracts slugs from given path
export const extractSlugsByRouteTemplate = (
  path: string,
  template: string,
): string[] => {
  const pathParts = path.split('/')
  const templateParts = template.split('/')

  return pathParts.filter((_, index) => {
    return templateParts[index]?.startsWith('[') ?? false
  })
}

/*
Finds the correct path for a given type and locale.
Returns /404 if no path is found
*/
export const linkResolver = (
  linkType: LinkResolverInput['linkType'],
  variables: LinkResolverInput['variables'] = [],
  locale: LinkResolverInput['locale'] = defaultLanguage,
): LinkResolverResponse => {
  /*
  We lowercase here to allow components to pass unmodified __typename fields
  The __typename fields seem to have case issues, that will be addressed at a later time
  We also guard against accidental passing of nully values. ??
  */
  const type = linkType?.toLowerCase() as
    | LinkResolverInput['linkType']
    | undefined
    | null

  // special case for external url resolution
  if (type === 'linkurl') {
    return {
      href: variables[0],
    }
  }

  // special case when link with slug is passed directly to the linkresolver
  if (type === 'link') {
    return {
      href: variables.join('/'),
    }
  }

  // We consider path not found if it has no entry in routesTemplate or if the found path is empty
  if (type && routesTemplate[type] && routesTemplate[type][locale]) {
    const typePath = routesTemplate[type][locale]

    if (variables.length) {
      // populate path templates with variables
      return {
        href: variables.reduce(
          (path, slug) => replaceVariableInPath(path, slug),
          typePath,
        ),
      }
    } else {
      // there are no variables, return path template as path
      return {
        href: typePath,
      }
    }
  } else {
    // we return to 404 page if no path is found, if this happens we have a bug
    return {
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
        return { type: 'homepage', locale: 'en', slug: [] }
      }

      // convert the route template string into a regex query
      const regex = convertToRegex(routeTemplate)

      // if the path starts with the routeTemplate string or matches dynamic route regex we have found the type
      if (
        (!skipDynamic && path?.match(regex)) ||
        (skipDynamic && path?.startsWith(routeTemplate))
      ) {
        return {
          slug: extractSlugsByRouteTemplate(path, routeTemplate),
          type,
          locale,
        } as TypeResolverResponse
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
    locale: LinkResolverInput['locale'] = context?.activeLocale,
  ) => linkResolver(linkType, variables, locale)
  return {
    typeResolver,
    linkResolver: wrappedLinkResolver,
  }
}
