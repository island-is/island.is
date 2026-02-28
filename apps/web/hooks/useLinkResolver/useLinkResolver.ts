import { useContext } from 'react'

import { defaultLanguage } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'

import { I18nContext, isLocale } from '../../i18n/I18n'

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
  organizationnewsoverview: {
    is: '/s/[organization]/frett',
    en: '/en/o/[organization]/news',
  },
  organizationeventoverview: {
    is: '/s/[organization]/vidburdir',
    en: '/en/o/[organization]/events',
  },
  aboutsubpage: {
    is: '/s/stafraent-island/[slug]',
    en: '',
  },
  applications: {
    is: '/yfirlit-umsokna',
    en: '/en/applications-overview',
  },
  page: {
    is: '/stafraent-island',
    en: '',
  },
  search: {
    is: '/leit',
    en: '/en/search',
  },
  articlecategories: {
    is: '/flokkur',
    en: '/en/category',
  },
  articlecategory: {
    is: '/flokkur/[slug]',
    en: '/en/category/[slug]',
  },
  articlegroup: {
    is: '/flokkur/[slug]#[subgroupSlug]',
    en: '/en/category/[slug]#[subgroupSlug]',
  },
  news: {
    is: '/frett/[slug]',
    en: '/en/news/[slug]',
  },
  newsoverview: {
    is: '/frett',
    en: '/en/news',
  },
  manual: {
    is: '/handbaekur/[slug]',
    en: '/en/manuals/[slug]',
  },
  manualchangelog: {
    is: '/handbaekur/[slug]/breytingasaga',
    en: '/en/manuals/[slug]/changelog',
  },
  manualchapteritem: {
    is: '/handbaekur/[slug]/[chapterSlug]?selectedItemId=[chapterItemId]',
    en: '/en/manuals/[slug]/[chapterSlug]?selectedItemId=[chapterItemId]',
  },
  manualchapter: {
    is: '/handbaekur/[slug]/[chapterSlug]',
    en: '/en/manuals/[slug]/[chapterSlug]',
  },
  vacancies: {
    is: '/starfatorg',
    en: '',
  },
  vacancydetails: {
    is: '/starfatorg/[id]',
    en: '',
  },
  pensioncalculatorresults: {
    is: '/s/tryggingastofnun/reiknivel/nidurstodur',
    en: '/en/o/social-insurance-administration/calculator/results',
  },
  pensioncalculator: {
    is: '/s/tryggingastofnun/reiknivel',
    en: '/en/o/social-insurance-administration/calculator',
  },
  directorateoflabourmypages: {
    is: '/s/vinnumalastofnun/minar-sidur',
    en: '/en/o/directorate-of-labour/my-pages',
  },
  digitalicelandservices: {
    is: '/s/stafraent-island/thjonustur',
    en: '/en/o/digital-iceland/island-services',
  },
  digitalicelandservicesdetailpage: {
    is: '/s/stafraent-island/thjonustur/[slug]',
    en: '/en/o/digital-iceland/island-services/[slug]',
  },
  digitalicelandcommunityoverview: {
    is: '/s/stafraent-island/island-is-samfelagid',
    en: '/en/o/digital-iceland/island-is-community',
  },
  digitalicelandcommunitydetailpage: {
    is: '/s/stafraent-island/island-is-samfelagid/[slug]',
    en: '/en/o/digital-iceland/island-is-community/[slug]',
  },
  organizationservices: {
    is: '/s/[slug]/thjonusta',
    en: '/en/o/[slug]/services',
  },
  organizationpublishedmaterial: {
    is: '/s/[slug]/utgefid-efni',
    en: '/en/o/[slug]/published-material',
  },
  auctions: {
    is: '/s/syslumenn/uppbod',
    en: '',
  },
  apicataloguedetailpage: {
    is: '/s/stafraent-island/vefthjonustur/[slug]',
    en: '/en/o/digital-iceland/webservices/[slug]',
  },
  apicataloguepage: {
    is: '/s/stafraent-island/vefthjonustur',
    en: '/en/o/digital-iceland/webservices',
  },
  organizationnews: {
    is: '/s/[organization]/frett/[slug]',
    en: '/en/o/[organization]/news/[slug]',
  },
  event: {
    is: '/s/[organization]/vidburdir/[slug]',
    en: '/en/o/[organization]/events/[slug]',
  },
  organizationsubpage: {
    is: '/s/[slug]/[subSlug]',
    en: '/en/o/[slug]/[subSlug]',
  },
  organizationpage: {
    is: '/s/[slug]',
    en: '/en/o/[slug]',
  },
  blooddonationrestrictionlist: {
    is: '/s/blodbankinn/ahrif-a-blodgjof',
    en: '/en/o/icelandic-blood-bank/affecting-factors',
  },
  blooddonationrestrictiondetails: {
    is: '/s/blodbankinn/ahrif-a-blodgjof/[id]',
    en: '/en/o/icelandic-blood-bank/affecting-factors/[id]',
  },
  organizationparentsubpagechild: {
    is: '/s/[slug]/[subSlug]/[childSlug]',
    en: '/en/o/[slug]/[subSlug]/[childSlug]',
  },
  grantsplaza: {
    is: '/styrkjatorg',
    en: '/en/grants-plaza',
  },
  grantsplazasearch: {
    is: '/styrkjatorg/styrkir',
    en: '/en/grants-plaza/grants',
  },
  grantsplazagrant: {
    is: '/styrkjatorg/styrkur/[id]',
    en: '/en/grants-plaza/grant/[id]',
  },
  openinvoices: {
    is: '/opnir-reikningar',
    en: '/en/open-invoices',
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
  projectnews: {
    is: '/v/[slug]/frett/[subSlug]',
    en: '/en/p/[slug]/news/[subSlug]',
  },
  projectnewsoverview: {
    is: '/v/[slug]/frett',
    en: '/en/p/[slug]/news',
  },
  projectsubpage: {
    is: '/v/[slug]/[subSlug]',
    en: '/en/p/[slug]/[subSlug]',
  },
  projectpage: {
    is: '/v/[slug]',
    en: '/en/p/[slug]',
  },
  organizationsubpagelistitem: {
    is: '/s/[organization]/[slug]/[listItemSlug]',
    en: '/en/o/[organization]/[slug]/[listItemSlug]',
  },
  projectsubpagelistitem: {
    is: '/v/[project]/[slug]/[listItemSlug]',
    en: '/en/p/[project]/[slug]/[listItemSlug]',
  },
  lifeevents: {
    is: '/lifsvidburdir',
    en: '/en/life-events',
  },
  lifeeventpage: {
    is: '/lifsvidburdir/[slug]',
    en: '/en/life-events/[slug]',
  },
  regulation: {
    is: '/reglugerdir/nr/[number]',
    en: '',
  },
  regulationshome: {
    is: '/reglugerdir',
    en: '',
  },
  ojoiadvert: {
    is: '/stjornartidindi/nr/[number]',
    en: '',
  },
  ojoisearch: {
    is: '/stjornartidindi/leit',
    en: '',
  },
  ojoicategories: {
    is: '/stjornartidindi/malaflokkar',
    en: '',
  },
  ojoirss: {
    is: '/stjornartidindi/rss',
    en: '',
  },
  ojoihome: {
    is: '/stjornartidindi',
    en: '',
  },
  ojoiabout: {
    is: '/stjornartidindi/um',
    en: '',
  },
  ojoihelp: {
    is: '/stjornartidindi/leidbeiningar',
    en: '',
  },
  login: {
    is: '/innskraning',
    en: '/en/login',
  },
  serviceweb: {
    is: '/adstod',
    en: '/en/help',
  },
  servicewebsearch: {
    is: '/adstod/leit',
    en: '/en/help/search',
  },
  serviceweborganization: {
    is: '/adstod/[slug]',
    en: '/en/help/[slug]',
  },
  servicewebcontact: {
    is: '/adstod/[organizationSlug]/hafa-samband',
    en: '/en/help/[organizationSlug]/contact-us',
  },
  serviceweborganizationsearch: {
    is: '/adstod/[organizationSlug]/leit',
    en: '/en/help/[organizationSlug]/search',
  },
  supportcategory: {
    is: '/adstod/[organizationSlug]/[categorySlug]',
    en: '/en/help/[organizationSlug]/[categorySlug]',
  },
  supportqna: {
    is: '/adstod/[organizationSlug]/[categorySlug]/[questionSlug]',
    en: '/en/help/[organizationSlug]/[categorySlug]/[questionSlug]',
  },
  subarticle: {
    is: '/[slug]/[subSlug]',
    en: '/en/[slug]/[subSlug]',
  },
  article: {
    is: '/[slug]',
    en: '/en/[slug]',
  },
  universitysearchdetails: {
    is: '/haskolanam/[id]',
    en: '/en/university-studies/[id]',
  },
  universitysearchcomparison: {
    is: '/haskolanam/samanburdur',
    en: '/en/university-studies/comparison',
  },
  universitysearch: {
    is: '/haskolanam/leit',
    en: '/en/university-studies/search',
  },
  universitysub: {
    is: '/haskolanam/upplysingar/[subSlug]',
    en: '/en/university-studies/info/[subSlug]',
  },
  universitylandingpage: {
    is: '/haskolanam',
    en: '/en/university-studies',
  },
  oskalistithjodarinnar: {
    is: '/oskalisti-thjodarinnar',
    en: '',
  },
  homepage: {
    is: '/',
    en: '/en',
  },
  undirskriftalistar: {
    is: '/undirskriftalistar',
    en: '/en/petitions',
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

/** Check if path is of link type */
export const pathIsRoute = (
  path: string,
  linkType: LinkType,
  locale?: Locale,
) => {
  const segments = path.split('/').filter((x) => x)

  const localeSegment = isLocale(segments[0]) ? segments[0] : ''
  const firstSegment = (localeSegment ? segments[1] : segments[0]) ?? ''

  const current = `/${
    localeSegment ? localeSegment + '/' : ''
  }${firstSegment}`.replace(/\/$/, '')

  return current === linkResolver(linkType, [], locale).href
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
