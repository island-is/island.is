import { Locale } from 'locale'
import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import {
  ContentLanguage,
  OrganizationPage,
  OrganizationTheme,
  Query,
  QueryGetOrganizationArgs,
  QueryGetOrganizationPageArgs,
} from '../graphql/schema'
import { linkResolver } from '../hooks'
import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../screens/queries'

// TODO: Perhaps add this functionality to the linkResolver
export const getOrganizationLink = (
  organization: { hasALandingPage?: boolean; slug: string; link?: string },
  locale: Locale,
) => {
  return organization?.hasALandingPage
    ? linkResolver('organizationpage', [organization.slug], locale).href
    : organization?.link
}

export const getOrganizationSidebarNavigationItems = (
  organizationPage: OrganizationPage,
  basePath: string,
) => {
  if (!organizationPage) return []
  return organizationPage.menuLinks.map(({ primaryLink, childrenLinks }) => ({
    title: primaryLink?.text ?? '',
    href: primaryLink?.url,
    active:
      primaryLink?.url === basePath ||
      childrenLinks.some((link) => link.url === basePath),
    items: childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: url === basePath,
    })),
  }))
}

export const getBackgroundStyle = (
  background?: Omit<OrganizationTheme, '__typename'> | null,
) => {
  if (!background) return ''
  if (
    background.useGradientColor &&
    background.gradientStartColor &&
    background.gradientEndColor
  )
    return `linear-gradient(99.09deg, ${background.gradientStartColor} 23.68%,
      ${background.gradientEndColor} 123.07%),
      linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%)`
  return background.backgroundColor ?? ''
}

/** Since "/en/o/icelandic-health-insurance" should now redirect to "/en/o/iceland-health" we make sure that if the cms is still referencing the old slug we fallback to fetching that data instead */
export const handleOrganizationSlugRedirect = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  slug: string | string[] | undefined | null,
  locale: string,
  organizationPage: {
    data: ApolloQueryResult<Query>['data']['getOrganizationPage']
    fetchIfMissing: boolean
  },
  organization: {
    data: ApolloQueryResult<Query>['data']['getOrganization']
    fetchIfMissing: boolean
  },
) => {
  const icelandicHealthInsuranceSlug = 'icelandic-health-insurance'

  let organizationPageData = organizationPage.data
  let organizationData = organization.data

  // Refetch data in case the "iceland-health" slug didn't get a match
  if (
    slug === 'iceland-health' &&
    (!organizationPage.data || !organization.data)
  ) {
    const responses = await Promise.all([
      organizationPage.fetchIfMissing
        ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
            query: GET_ORGANIZATION_PAGE_QUERY,
            variables: {
              input: {
                slug: icelandicHealthInsuranceSlug,
                lang: locale as ContentLanguage,
              },
            },
          })
        : { data: { getOrganizationPage: organizationPageData } },
      organization.fetchIfMissing
        ? apolloClient.query<Query, QueryGetOrganizationArgs>({
            query: GET_ORGANIZATION_QUERY,
            variables: {
              input: {
                slug: icelandicHealthInsuranceSlug,
                lang: locale as ContentLanguage,
              },
            },
          })
        : { data: { getOrganization: organizationData } },
    ])
    organizationPageData = responses[0].data.getOrganizationPage
    organizationData = responses[1].data.getOrganization
  }

  return {
    organizationPage: organizationPageData,
    organization: organizationData,
  }
}
