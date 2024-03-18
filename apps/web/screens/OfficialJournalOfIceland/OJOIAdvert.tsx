import { useMemo } from 'react'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { Locale } from 'locale'

import { MinistryOfJusticeAdvertResponse } from '@island.is/api/schema'
import { Box, Button, Link, Stack, Text } from '@island.is/island-ui/core'
import { getThemeConfig } from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryMinistryOfJusticeAdvertArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  OJOIWrapper,
  searchUrl,
} from '../../components/OfficialJournalOfIceland'
import { OJOIAdvertDisplay } from '../../components/OfficialJournalOfIceland/OJOIAdvertDisplay'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../queries'
import { ADVERT_QUERY } from '../queries/OfficialJournalOfIceland'

const OJOIAdvertPage: Screen<OJOIAdvertProps> = ({
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
    <OJOIWrapper
      pageTitle={advert.title}
      hideTitle
      pageDescription={
        'Sé munur á uppsetningu texta hér að neðan og í PDF skjali gildir PDF skjalið.'
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
      breadcrumbItems={breadcrumbItems}
      goBackUrl={searchUrl}
      sidebarContent={
        <Stack space={[2]}>
          <Box background="blue100" padding={[2, 2, 3]} borderRadius="large">
            <Stack space={[1, 1, 2]}>
              <Text variant="h4">Upplýsingar um auglýsingu</Text>

              <Box>
                <Text variant="h5">Deild</Text>
                <Text variant="small">{advert.department.title}</Text>
              </Box>

              <Box>
                <Text variant="h5">Stofnun</Text>
                <Text variant="small">{advert.involvedParty.title}</Text>
              </Box>

              <Box>
                <Text variant="h5">Málaflokkur</Text>
                <Text variant="small">
                  {advert.categories.map((c) => c.title).join(', ')}
                </Text>
              </Box>

              <Box>
                <Text variant="h5">Skráningardagur</Text>
                <Text variant="small">
                  {format(new Date(advert.createdDate), 'dd. MMMM yyyy', {
                    locale: is,
                  })}
                </Text>
              </Box>

              <Box>
                <Text variant="h5">Útgáfudagur</Text>
                <Text variant="small">
                  {format(new Date(advert.publicationDate), 'dd. MMMM yyyy', {
                    locale: is,
                  })}
                </Text>
              </Box>
            </Stack>
          </Box>

          <Box
            background="blueberry100"
            padding={[2, 2, 3]}
            borderRadius="large"
          >
            <Stack space={[1, 1, 2]}>
              <Box href="/" component={Link}>
                <Button
                  variant="text"
                  as="span"
                  icon="download"
                  iconType="outline"
                  size="small"
                >
                  Sækja PDF
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      }
    >
      <OJOIAdvertDisplay
        advertText={advert.document.html}
        isLegacy={advert.document.isLegacy ?? false}
      />
    </OJOIWrapper>
  )
}

interface OJOIAdvertProps {
  advert: MinistryOfJusticeAdvertResponse['advert']
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const OJOIAdvert: Screen<OJOIAdvertProps> = ({
  advert,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  console.log({ advert })

  return (
    <OJOIAdvertPage
      advert={advert}
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

OJOIAdvert.getProps = async ({ apolloClient, locale, query }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { ministryOfJusticeAdvert },
    },
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryMinistryOfJusticeAdvertArgs>({
      query: ADVERT_QUERY,
      variables: {
        params: {
          id: query.nr as string,
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

  if (!ministryOfJusticeAdvert) {
    throw new CustomNextError(404, 'OJOI advert not found')
  }

  return {
    advert: ministryOfJusticeAdvert.advert,
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

export default withMainLayout(OJOIAdvert)
