import React, { useContext } from 'react'
import { Locale, I18nContext } from './I18n'

interface LinkResolverResponse {
  href: string
  as: string
}

interface LinkResolverInput {
  linkType: LinkType
  slugs?: Array<string>
  locale?: Locale
}

interface TypeResolverResponse {
  type: LinkType
  locale: Locale
}

type LinkType = keyof typeof routesTemplate

// the order matters, arrange from most specific to least specific for correct type resolution
export const routesTemplate = {
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
  lifeeventpage: {
    is: '/lifsvidburdur/[slug]',
    en: '/en/life-event/[slug]',
  },
  adgerdirfrontpage: {
    is: '/covid-adgerdir',
    en: '/en/covid-operations',
  },
  adgerdirpage: {
    is: '/covid-adgerdir/[slug]',
    en: '/en/covid-operations/[slug]',
  },
  homepage: {
    is: '/',
    en: '/en',
  },
  article: {
    is: '/[slug]',
    en: '/en/[slug]',
  },
  subarticle: {
    is: '/[slug]/[subSlug]',
    en: '/en/[slug]/[subSlug]',
  },
  linkurl: {
    is: '[slug]',
    en: '[slug]',
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
    .replace(/\[\w+\]/g, '\\[\\w+\\]') // make path variables be regex word matches

// tries to return url for given type
export const linkResolver = ({
  linkType,
  slugs,
  locale,
}: LinkResolverInput): LinkResolverResponse => {
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

// tries to return type for given path
export const typeResolver = (path: string): TypeResolverResponse | null => {
  for (const [type, locales] of Object.entries(routesTemplate)) {
    for (const [locale, routeTemplate] of Object.entries(locales)) {
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
  // TODO: use useCallback here
  const wrappedLinkResolver = (
    linkType: LinkResolverInput['linkType'],
    slugs: LinkResolverInput['slugs'] = [],
    locale: LinkResolverInput['locale'] = context.activeLocale,
  ) =>
    linkResolver({
      locale: context.activeLocale,
      ...{
        linkType,
        slugs,
        locale,
      },
    })
  return {
    typeResolver,
    linkResolver: wrappedLinkResolver,
  }
}

export default useLinkResolver
