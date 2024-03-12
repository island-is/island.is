import { useMemo } from 'react'
import { Locale } from 'locale'

import { Box, Stack, Table as T, Text } from '@island.is/island-ui/core'
import { getThemeConfig } from '@island.is/web/components'
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetSingleNewsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  baseUrl,
  StjornartidindiWrapper,
} from '../../../components/Stjornartidindi'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from '../../queries'

const StjornartidindiAdvertPage: Screen<StjornartidindiAdvertProps> = ({
  advert,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage?.id)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organizationPage?.title ?? '',
      href: linkResolver(
        'organizationpage',
        [organizationPage?.slug ?? ''],
        locale,
      ).href,
    },
    {
      title: 'Auglýsing',
    },
  ]

  return (
    <StjornartidindiWrapper
      pageTitle={'Auglýsing'}
      pageDescription={
        'Sé munur á uppsetningu texta hér að neðan og í PDF skjali gildir PDF skjalið.'
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
      breadcrumbItems={breadcrumbItems}
      goBackUrl={baseUrl}
      sidebarContent={
        <Box background="blue100" padding={[2, 2, 3]} borderRadius="large">
          <Stack space={[1, 1, 2]}>
            <Text variant="h4">Upplýsingar um auglýsingu</Text>

            <Box>
              <Text variant="h5">Deild</Text>
              <Text variant="small">B-Deild</Text>
            </Box>

            <Box>
              <Text variant="h5">Stofnun</Text>
              <Text variant="small">Matvælaráðuneytið</Text>
            </Box>
          </Stack>
        </Box>
      }
    >
      <Box>Auglýsing</Box>
    </StjornartidindiWrapper>
  )
}

interface StjornartidindiAdvertProps {
  advert: GetSingleNewsItemQuery['getSingleNews']
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const StjornartidindiAdvert: Screen<StjornartidindiAdvertProps> = ({
  advert,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <StjornartidindiAdvertPage
      advert={advert}
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

StjornartidindiAdvert.getProps = async ({ apolloClient, locale, query }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { getSingleNews: advert },
    },
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSingleNewsItemQuery, QueryGetSingleNewsArgs>({
      query: GET_SINGLE_NEWS_ITEM_QUERY,
      variables: {
        input: {
          slug: query.nr as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage && !getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!advert) {
    throw new CustomNextError(404, 'News not found')
  }

  return {
    advert,
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    namespace,
    locale: locale as Locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(StjornartidindiAdvert)
