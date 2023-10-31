import cn from 'classnames'
import type { Locale } from 'locale'
import { useRouter } from 'next/router'

import { EmbeddedVideo, Image } from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  GridColumn,
  GridRow,
  Icon,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  EventLocation,
  EventTime,
  getThemeConfig,
  HeadWithSocialSharing,
  OrganizationWrapper,
} from '@island.is/web/components'
import {
  ContentLanguage,
  Event as EventModel,
  GetNamespaceQuery,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetSingleEventArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'
import { webRichText } from '@island.is/web/utils/richText'

import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { GET_SINGLE_EVENT_QUERY } from '../../queries/Events'
import * as styles from './OrganizationEventArticle.css'

const LAYOUT_CHANGE_BREAKPOINT = 1120
const ICON_TEXT_SPACE: ResponsiveSpace = [3, 3, 3, 2, 3]

const EventItemImage = ({
  eventItem,
  floatRight = true,
}: {
  eventItem: EventModel
  floatRight?: boolean
}) => {
  if (!eventItem?.contentImage) return null
  return (
    <Box
      paddingY={2}
      className={cn({
        [styles.floatedImage]: floatRight,
      })}
    >
      <Image
        {...eventItem.contentImage}
        url={
          eventItem.contentImage?.url
            ? eventItem.contentImage?.url + '?w=774&fm=webp&q=80'
            : ''
        }
        thumbnail={
          eventItem.contentImage?.url
            ? eventItem.contentImage?.url + '?w=50&fm=webp&q=80'
            : ''
        }
      />
    </Box>
  )
}

const EventInformationBox = ({
  event,
  namespace,
}: {
  event: EventModel
  namespace: Record<string, string>
}) => {
  const { activeLocale } = useI18n()
  const { format } = useDateUtils()
  const formattedDate =
    event.startDate && format(new Date(event.startDate), 'do MMMM yyyy')
  const n = useNamespace(namespace)

  return (
    <Box background="blue100" borderRadius="large" padding={[3, 3, 3, 2, 3]}>
      <Stack space={3}>
        <Box display="flex" flexWrap="nowrap" columnGap={ICON_TEXT_SPACE}>
          <Icon color="blue400" icon="calendar" type="outline" />
          <Text>{formattedDate}</Text>
        </Box>
        {event.time?.startTime && (
          <Box display="flex" flexWrap="nowrap" columnGap={ICON_TEXT_SPACE}>
            <Icon color="blue400" icon="time" type="outline" />
            <EventTime
              startTime={event.time?.startTime ?? ''}
              endTime={event.time?.endTime ?? ''}
              timeSuffix={
                n('timeSuffix', activeLocale === 'is' ? 'til' : 'to') as string
              }
            />
          </Box>
        )}
        {event.location && (
          <Box display="flex" flexWrap="nowrap" columnGap={ICON_TEXT_SPACE}>
            <Box>
              <Icon color="blue400" icon="home" type="outline" />
            </Box>
            <EventLocation location={event.location} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

interface OrganizationEventArticleProps {
  organizationPage: OrganizationPage
  event: EventModel
  namespace: Record<string, string>
  locale: Locale
}

const OrganizationEventArticle: Screen<OrganizationEventArticleProps> = ({
  organizationPage,
  event,
  namespace,
  locale,
}) => {
  const n = useNamespace(namespace)
  const router = useRouter()

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()

  const isSmall = width <= LAYOUT_CHANGE_BREAKPOINT

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
        <Text variant="h1" as="h1" paddingBottom={5}>
          {event.title}
        </Text>

        {event?.video && (
          <GridRow>
            <GridColumn paddingBottom={3} span={isSmall ? '12/12' : '7/12'}>
              <EmbeddedVideo
                url={event.video.url}
                locale={locale}
                title={event.video.title}
              />
            </GridColumn>
            <GridColumn
              span={isSmall ? '12/12' : '5/12'}
              paddingTop={event.video?.url ? [2, 2, 2, 0, 0] : 2}
              paddingBottom={2}
            >
              <EventInformationBox event={event} namespace={namespace} />
            </GridColumn>
          </GridRow>
        )}

        <GridRow>
          {event?.video && (
            <GridColumn paddingBottom={3} span={isSmall ? '12/12' : '7/12'}>
              <EmbeddedVideo
                url={event.video.url}
                locale={locale}
                title={event.video.title}
              />
            </GridColumn>
          )}
          <GridColumn
            span={isSmall ? '12/12' : '5/12'}
            paddingTop={event.video?.url ? [2, 2, 2, 0, 0] : 2}
            paddingBottom={2}
          >
            <Box
              background="blue100"
              borderRadius="large"
              padding={[3, 3, 3, 2, 3]}
            ></Box>
          </GridColumn>
          {!isSmall && !event.video?.url && event.contentImage && (
            <GridColumn paddingBottom={3} span={isSmall ? '12/12' : '7/12'}>
              <EventItemImage eventItem={event} floatRight={false} />
            </GridColumn>
          )}
        </GridRow>
        {isSmall && !event.video?.url && event.contentImage && (
          <GridColumn paddingBottom={3}>
            <EventItemImage eventItem={event} floatRight={false} />
          </GridColumn>
        )}

        {!isSmall && event.video?.url && event.contentImage && (
          <GridColumn>
            <EventItemImage eventItem={event} />
          </GridColumn>
        )}
        <Text>
          {webRichText(
            event.content ?? [],
            {
              renderComponent: {
                // Make sure that images in the content are full width
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                Image: (slice) => (
                  <Box className={styles.clearBoth}>
                    <Image {...slice} thumbnail={slice.url + '?w=50'} />
                  </Box>
                ),
              },
            },
            activeLocale,
          )}
        </Text>

        {isSmall && event.video?.url && event.contentImage && (
          <GridColumn paddingTop={3} paddingBottom={3}>
            <EventItemImage eventItem={event} floatRight={false} />
          </GridColumn>
        )}
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
OrganizationEventArticle.getProps = async ({ apolloClient, query, locale }) => {
  const [organizationPageResponse, eventResponse, namespace] =
    await Promise.all([
      apolloClient.query<Query, QueryGetOrganizationPageArgs>({
        query: GET_ORGANIZATION_PAGE_QUERY,
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
      apolloClient
        .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
          query: GET_NAMESPACE_QUERY,
          variables: {
            input: {
              lang: locale as ContentLanguage,
              namespace: 'OrganizationPages',
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

  return {
    organizationPage,
    event,
    namespace,
    locale: locale as Locale,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationEventArticle)
