import type { Locale } from 'locale'
import { useRouter } from 'next/router'

import {
  Box,
  BreadCrumbItem,
  LinkV2,
  Pagination,
} from '@island.is/island-ui/core'
import {
  EventList,
  getThemeConfig,
  OrganizationWrapper,
} from '@island.is/web/components'
import {
  ContentLanguage,
  EventList as EventListSchema,
  GetNamespaceQuery,
  OrganizationPage,
  Query,
  QueryGetEventsArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespaceStrict } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'

import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_EVENTS_QUERY } from '../../queries/Events'

const PAGE_SIZE = 10

interface OrganizationEventListProps {
  organizationPage: OrganizationPage
  eventList: EventListSchema
  namespace: Record<string, string>
  selectedPage: number
}

const OrganizationEventList: Screen<OrganizationEventListProps> = ({
  organizationPage,
  eventList,
  namespace,

  selectedPage,
}) => {
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { linkResolver } = useLinkResolver()
  const n = useNamespaceStrict(namespace)
  const { activeLocale } = useI18n()

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', []).href,
      typename: 'homepage',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug]).href,
      typename: 'organizationpage',
    },
  ]

  const eventsHeading = n(
    'eventPageTitle',
    activeLocale === 'is' ? 'Viðburðir' : 'Events',
  )

  const eventOverviewHref = linkResolver('organizationeventoverview', [
    organizationPage.slug,
  ]).href

  return (
    <OrganizationWrapper
      pageTitle={eventsHeading}
      organizationPage={organizationPage}
      showReadSpeaker={false}
      breadcrumbItems={breadCrumbs}
      navigationData={{
        title: n(
          'navigationTitle',
          activeLocale === 'is' ? 'Efnisyfirlit' : 'Menu',
        ),
        items: getOrganizationSidebarNavigationItems(
          organizationPage,
          baseRouterPath,
        ),
      }}
    >
      <EventList
        title={eventsHeading}
        namespace={namespace}
        eventList={eventList?.items}
        parentPageSlug={organizationPage.slug}
      />

      {!!eventList.items.length && eventList.total > PAGE_SIZE && (
        <Box marginTop={[4, 4, 8]}>
          <Pagination
            totalPages={Math.ceil(eventList.total / PAGE_SIZE)}
            page={selectedPage}
            renderLink={(page, className, children) => (
              <LinkV2
                href={{
                  pathname: eventOverviewHref,
                  query: { page },
                }}
              >
                <span className={className}>{children}</span>
              </LinkV2>
            )}
          />
        </Box>
      )}
    </OrganizationWrapper>
  )
}

const extractPageNumberQueryParameter = (query: ScreenContext['query']) => {
  if (typeof query?.page === 'string') {
    const numericPageValue = Number(query.page)
    const isNumber = !isNaN(numericPageValue)
    if (isNumber) {
      return numericPageValue
    }
  }
  return 1
}

OrganizationEventList.getProps = async ({ apolloClient, query, locale }) => {
  const [organizationPageResponse] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as Locale,
        },
      },
    }),
  ])

  const organizationPage = organizationPageResponse?.data?.getOrganizationPage

  if (!organizationPage) {
    throw new CustomNextError(
      404,
      `Could not find organization page with slug: ${query.slug}`,
    )
  }

  const selectedPage = extractPageNumberQueryParameter(query)

  const [eventsResponse, namespace] = await Promise.all([
    apolloClient.query<Query, QueryGetEventsArgs>({
      query: GET_EVENTS_QUERY,
      variables: {
        input: {
          organization:
            organizationPage?.organization?.slug ?? (query.slug as string),
          lang: locale as Locale,
          page: selectedPage,
          size: PAGE_SIZE,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'EventList',
          },
        },
      })
      // map data here to reduce data processing in component
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  return {
    organizationPage,
    eventList: eventsResponse?.data?.getEvents,
    namespace,
    selectedPage,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationEventList)
