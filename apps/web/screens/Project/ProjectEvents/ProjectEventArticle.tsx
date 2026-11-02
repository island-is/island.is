import { BreadCrumbItem } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import { EventArticle, HeadWithSocialSharing } from '@island.is/web/components'
import {
  Event as EventModel,
  ProjectPage,
  Query,
  QueryGetProjectPageArgs,
  QueryGetSingleEventArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  fetchEventNamespace,
  getHasEventOccurred,
  isEventFromOrganization,
} from '@island.is/web/utils/eventPage'

import { GET_SINGLE_EVENT_QUERY } from '../../queries/Events'
import { GET_PROJECT_PAGE_QUERY } from '../../queries/Project'
import { ProjectWrapper } from '../components/ProjectWrapper'
import { getProjectEventsOrganizationSlug, getThemeConfig } from '../utils'

interface ProjectEventArticleProps {
  projectPage: ProjectPage
  event: EventModel
  namespace: Record<string, string>
  locale: Locale
  hasEventOccurred: boolean
}

const ProjectEventArticle: Screen<ProjectEventArticleProps> = ({
  projectPage,
  event,
  namespace,
  locale,
  hasEventOccurred,
}) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  useContentfulId(projectPage.id, event.id)
  useLocalLinkTypeResolver('projectevent')

  const eventsHeading = n(
    'eventListPageTitle',
    activeLocale === 'is' ? 'Viðburðir' : 'Events',
  ) as string

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
    {
      title: eventsHeading,
      href: linkResolver('projecteventoverview', [projectPage.slug]).href,
      typename: 'projecteventoverview',
    },
  ]

  const socialImage =
    event.featuredImage ?? event.contentImage ?? event.thumbnailImage

  return (
    <>
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
        <EventArticle
          event={event}
          namespace={namespace}
          locale={locale}
          hasEventOccurred={hasEventOccurred}
        />
      </ProjectWrapper>
      <HeadWithSocialSharing
        title={`${event.title ?? ''} | ${projectPage.title}`}
        imageUrl={socialImage?.url}
        imageWidth={socialImage?.width.toString()}
        imageHeight={socialImage?.height.toString()}
      />
    </>
  )
}

ProjectEventArticle.getProps = async ({ apolloClient, query, locale }) => {
  const [projectPageResponse, eventResponse, namespace] = await Promise.all([
    apolloClient.query<Query, QueryGetProjectPageArgs>({
      query: GET_PROJECT_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as Locale,
        },
      },
    }),
    apolloClient.query<Query, QueryGetSingleEventArgs>({
      query: GET_SINGLE_EVENT_QUERY,
      variables: {
        input: {
          slug: query.eventSlug as string,
          lang: locale as Locale,
        },
      },
    }),
    fetchEventNamespace(apolloClient, locale),
  ])

  const projectPage = projectPageResponse?.data?.getProjectPage

  if (!projectPage) {
    throw new CustomNextError(
      404,
      `Could not find project page with slug: ${query.slug}`,
    )
  }

  const event = eventResponse?.data?.getSingleEvent

  if (!event) {
    throw new CustomNextError(
      404,
      `Could not find event with slug: ${query.eventSlug}`,
    )
  }

  const organizationSlug = getProjectEventsOrganizationSlug(projectPage)

  if (!isEventFromOrganization(event, organizationSlug)) {
    throw new CustomNextError(
      404,
      `Event ${event.slug} does not belong to project ${projectPage.slug}`,
    )
  }

  return {
    projectPage,
    event,
    namespace,
    locale: locale as Locale,
    hasEventOccurred: getHasEventOccurred(event),
    ...getThemeConfig(projectPage),
  }
}

export default withMainLayout(ProjectEventArticle)
