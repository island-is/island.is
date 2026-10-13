import {
  Box,
  BreadCrumbItem,
  LinkV2,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import {
  EventList,
  HeadWithSocialSharing,
  Webreader,
} from '@island.is/web/components'
import {
  EventList as EventListSchema,
  ProjectPage,
  Query,
  QueryGetEventsArgs,
  QueryGetProjectPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getIntParam } from '@island.is/web/utils/queryParams'
import { fetchEventNamespace } from '@island.is/web/utils/eventPage'

import { GET_EVENTS_QUERY } from '../../queries/Events'
import { GET_PROJECT_PAGE_QUERY } from '../../queries/Project'
import { ProjectWrapper } from '../components/ProjectWrapper'
import { getProjectEventsOrganizationSlug, getThemeConfig } from '../utils'

const PAGE_SIZE = 10

interface ProjectEventListProps {
  projectPage: ProjectPage
  eventList: EventListSchema
  namespace: Record<string, string>
  selectedPage: number
}

const ProjectEventList: Screen<ProjectEventListProps> = ({
  projectPage,
  eventList,
  namespace,
  selectedPage,
}) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  useContentfulId(projectPage.id)
  useLocalLinkTypeResolver('projecteventoverview')

  const eventsHeading = n(
    'eventListPageTitle',
    activeLocale === 'is' ? 'Viðburðir' : 'Events',
  ) as string

  const eventOverviewHref = linkResolver('projecteventoverview', [
    projectPage.slug,
  ]).href

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', []).href,
      typename: 'homepage',
    },
    {
      title: projectPage.title,
      href: linkResolver('projectpage', [projectPage.slug]).href,
      typename: 'projectpage',
    },
  ]

  return (
    <>
      <HeadWithSocialSharing
        title={`${eventsHeading} | ${projectPage.title}`}
      />
      <ProjectWrapper
        projectPage={projectPage}
        breadcrumbItems={breadCrumbs}
        sidebarNavigationTitle={
          n(
            'navigationTitle',
            activeLocale === 'is' ? 'Efnisyfirlit' : 'Menu',
          ) as string
        }
        withSidebar={projectPage.sidebar}
      >
        <Box paddingBottom={3}>
          <Stack space={[3, 3, 4]}>
            <Text variant="h1" as="h1" marginBottom={0}>
              {eventsHeading}
            </Text>
            <Webreader
              marginTop={0}
              marginBottom={0}
              readId={undefined}
              readClass="rs_read"
            />
            <EventList
              namespace={namespace}
              eventList={eventList?.items ?? []}
              parentPageSlug={projectPage.slug}
              eventLinkType="projectevent"
            />
          </Stack>

          {!!eventList?.items.length && eventList.total > PAGE_SIZE && (
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
        </Box>
      </ProjectWrapper>
    </>
  )
}

ProjectEventList.getProps = async ({ apolloClient, query, locale }) => {
  const projectPage = (
    await apolloClient.query<Query, QueryGetProjectPageArgs>({
      query: GET_PROJECT_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as Locale,
        },
      },
    })
  ).data?.getProjectPage

  if (!projectPage) {
    throw new CustomNextError(
      404,
      `Could not find project page with slug: ${query.slug}`,
    )
  }

  const organizationSlug = getProjectEventsOrganizationSlug(projectPage)

  if (!organizationSlug) {
    throw new CustomNextError(
      404,
      `Project page ${projectPage.slug} has no LatestEventsSlice with an organization`,
    )
  }

  const selectedPage = getIntParam(query.page, { minValue: 1 }) ?? 1

  const [eventsResponse, namespace] = await Promise.all([
    apolloClient.query<Query, QueryGetEventsArgs>({
      query: GET_EVENTS_QUERY,
      variables: {
        input: {
          organization: organizationSlug,
          lang: locale as Locale,
          page: selectedPage,
          size: PAGE_SIZE,
          order: 'asc',
        },
      },
    }),
    fetchEventNamespace(apolloClient, locale),
  ])

  return {
    projectPage,
    eventList: eventsResponse?.data?.getEvents,
    namespace,
    selectedPage,
    ...getThemeConfig(projectPage),
  }
}

export default withMainLayout(ProjectEventList)
