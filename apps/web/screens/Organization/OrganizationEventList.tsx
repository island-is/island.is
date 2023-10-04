import type { Locale } from 'locale'
import { useRouter } from 'next/router'
import { Box, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { OrganizationWrapper, getThemeConfig } from '@island.is/web/components'
import {
  OrganizationPage,
  Query,
  QueryGetEventsArgs,
  QueryGetOrganizationPageArgs,
  EventList,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'
import { GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { GET_EVENTS_QUERY } from '../queries/Events'
import { useLinkResolver } from '@island.is/web/hooks'

const PAGE_SIZE = 10

interface OrganizationEventListProps {
  organizationPage: OrganizationPage
  eventList?: EventList
}

const OrganizationEventList: Screen<OrganizationEventListProps> = ({
  organizationPage,
  eventList,
}) => {
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { linkResolver } = useLinkResolver()

  const eventsHeading = 'Viðburðir' // TODO: add namespace

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{
        title: 'Efnisyfirlit', // TODO: add namespace
        items: getOrganizationSidebarNavigationItems(
          organizationPage,
          baseRouterPath,
        ),
      }}
      pageTitle={eventsHeading}
    >
      <Text variant="h1" as="h1">
        {eventsHeading}
      </Text>
      <Stack space={2}>
        {eventList?.items?.map((event) => (
          <LinkV2
            key={event.id}
            href={
              linkResolver('organizationevent', [
                organizationPage.slug,
                event.slug,
              ]).href
            }
          >
            <Box border="standard">{event.title}</Box>
          </LinkV2>
        ))}
      </Stack>
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

  const [eventsResponse] = await Promise.all([
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
  ])

  return {
    organizationPage,
    eventList: eventsResponse?.data?.getEvents,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationEventList)
