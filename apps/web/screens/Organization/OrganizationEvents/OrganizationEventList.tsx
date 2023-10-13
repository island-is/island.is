import type { Locale } from 'locale'
import { useRouter } from 'next/router'
import { BreadCrumbItem } from '@island.is/island-ui/core'
import {
  EventsList,
  OrganizationWrapper,
  getThemeConfig,
} from '@island.is/web/components'
import {
  OrganizationPage,
  Query,
  QueryGetEventsArgs,
  QueryGetOrganizationPageArgs,
  EventList,
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
  ContentLanguage,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_EVENTS_QUERY } from '../../queries/Events'
import { useLinkResolver, useNamespaceStrict } from '@island.is/web/hooks'
const PAGE_SIZE = 10

interface OrganizationEventListProps {
  organizationPage: OrganizationPage
  eventList: EventList
  namespace: Record<string, string>
  locale: Locale
}

const OrganizationEventList: Screen<OrganizationEventListProps> = ({
  organizationPage,
  eventList,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { linkResolver } = useLinkResolver()
  const n = useNamespaceStrict(namespace)

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
      typename: 'homepage',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug], locale)
        .href,
      typename: 'organizationpage',
    },
  ]
  const eventOverviewUrl = linkResolver(
    'organizationeventoverview',
    [organizationPage.slug],
    locale,
  ).href

  const eventsHeading = n('eventPageTitle', 'Viðburðir')

  return (
    <OrganizationWrapper
      pageTitle={eventsHeading}
      organizationPage={organizationPage}
      showReadSpeaker={false}
      breadcrumbItems={breadCrumbs}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: getOrganizationSidebarNavigationItems(
          organizationPage,
          baseRouterPath,
        ),
      }}
    >
      <EventsList
        title={eventsHeading}
        namespace={namespace}
        eventList={eventList?.items}
        selectedPage={0}
        eventOverviewUrl={eventOverviewUrl}
        eventItemLinkType={'organizationevent'}
        parentPageSlug={organizationPage.slug}
      />
    </OrganizationWrapper>
  )
}

const extractPageNumberQueryParameter = (query: ScreenContext['query']) => {
  if (typeof query?.page === 'string') {
    const numericPageValue = Number(query.page)
    const isNumber = !isNaN(numericPageValue)
    if (isNumber) {
      // TODO: perhaps consider if we should check min or max value
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

  const [eventsResponse, namespace] = await Promise.all([
    apolloClient.query<Query, QueryGetEventsArgs>({
      query: GET_EVENTS_QUERY,
      variables: {
        input: {
          organization:
            organizationPage?.organization?.slug ?? (query.slug as string),
          lang: locale as Locale,
          page: extractPageNumberQueryParameter(query),
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
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  return {
    organizationPage,
    eventList: eventsResponse?.data?.getEvents,
    namespace,
    locale: locale as Locale,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationEventList)
