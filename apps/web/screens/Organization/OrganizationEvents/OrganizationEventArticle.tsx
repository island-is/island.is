import { useRouter } from 'next/router'

import { BreadCrumbItem } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import {
  EventArticle,
  getThemeConfig,
  HeadWithSocialSharing,
  OrganizationWrapper,
} from '@island.is/web/components'
import {
  Event as EventModel,
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
  QueryGetSingleEventArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  fetchEventNamespace,
  getHasEventOccurred,
  isEventFromOrganization,
} from '@island.is/web/utils/eventPage'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'

import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_SINGLE_EVENT_QUERY } from '../../queries/Events'

export interface OrganizationEventArticleProps {
  organizationPage: OrganizationPage
  event: EventModel
  namespace: Record<string, string>
  locale: Locale
  hasEventOccurred: boolean
}

type OrganizationEventArticleScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const OrganizationEventArticle: Screen<
  OrganizationEventArticleProps,
  OrganizationEventArticleScreenContext
> = ({ organizationPage, event, namespace, locale, hasEventOccurred }) => {
  const n = useNamespace(namespace)
  const router = useRouter()

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  useLocalLinkTypeResolver()
  useContentfulId(organizationPage?.id, event?.id)

  const eventsHeading = n(
    'eventListPageTitle',
    activeLocale === 'is' ? 'Viðburðir' : 'Events',
  )

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

    {
      title: eventsHeading,
      href: linkResolver('organizationeventoverview', [organizationPage.slug])
        .href,
      typename: 'organizationpage',
    },
  ]

  const socialImage =
    event.featuredImage ?? event.contentImage ?? event.thumbnailImage

  return (
    <>
      <OrganizationWrapper
        organizationPage={organizationPage}
        pageTitle={event.title}
        breadcrumbItems={breadCrumbs}
        showReadSpeaker={false}
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
        <EventArticle
          event={event}
          namespace={namespace}
          locale={locale}
          hasEventOccurred={hasEventOccurred}
        />
      </OrganizationWrapper>
      <HeadWithSocialSharing
        title={`${event.title ?? ''} | ${organizationPage.title}`}
        imageUrl={socialImage?.url}
        imageWidth={socialImage?.width.toString()}
        imageHeight={socialImage?.height.toString()}
      />
    </>
  )
}
OrganizationEventArticle.getProps = async ({
  apolloClient,
  query,
  locale,
  organizationPage: _organizationPage,
}) => {
  const [organizationPageSlug, _, eventSlug] = query.slugs as string[]
  const [organizationPageResponse, eventResponse, namespace] =
    await Promise.all([
      !_organizationPage
        ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
            query: GET_ORGANIZATION_PAGE_QUERY,
            variables: {
              input: {
                slug: organizationPageSlug,
                lang: locale as Locale,
                subpageSlugs: [locale === 'is' ? 'vidburdir' : 'events'],
              },
            },
          })
        : { data: { getOrganizationPage: _organizationPage } },
      apolloClient.query<Query, QueryGetSingleEventArgs>({
        query: GET_SINGLE_EVENT_QUERY,
        variables: {
          input: {
            slug: eventSlug,
            lang: locale as Locale,
          },
        },
      }),
      fetchEventNamespace(apolloClient, locale),
    ])

  const organizationPage = organizationPageResponse?.data?.getOrganizationPage

  if (!organizationPage) {
    throw new CustomNextError(
      404,
      `Could not find organization page with slug: ${query.slug}`,
    )
  }

  const event = eventResponse?.data?.getSingleEvent

  if (!event) {
    throw new CustomNextError(
      404,
      `Could not find event with slug: ${query.eventSlug}`,
    )
  }

  if (!isEventFromOrganization(event, organizationPage.organization?.slug)) {
    throw new CustomNextError(
      404,
      `Event ${event.slug} does not belong to organization ${organizationPage.organization?.slug}`,
    )
  }

  const organizationNamespace = extractNamespaceFromOrganization(
    organizationPage?.organization,
  )

  return {
    organizationPage,
    event,
    namespace,
    locale: locale as Locale,
    hasEventOccurred: getHasEventOccurred(event),
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationEventArticle)
