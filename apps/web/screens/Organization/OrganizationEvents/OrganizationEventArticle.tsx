import { useEffect, useState } from 'react'
import type { Locale } from 'locale'
import { useRouter } from 'next/router'

import { EmbeddedVideo } from '@island.is/island-ui/contentful'
import {
  Box,
  BreadCrumbItem,
  GridColumn,
  GridRow,
  Icon,
  Inline,
  ResponsiveSpace,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
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
import { linkResolver } from '@island.is/web/hooks/useLinkResolver'
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
  const { format } = useDateUtils()
  const formattedDate =
    event.startDate && format(new Date(event.startDate), 'do MMMM yyyy')
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()
  const ICON_TEXT_SPACE: ResponsiveSpace = [3, 3, 3, 2, 3]

  const { width } = useWindowSize()
  const [isSmall, setIsSmall] = useState<boolean | null>(null)
  //setting a specific breakpoint to change the layout
  useEffect(() => {
    setIsSmall(width <= 1120)
  }, [width])

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

  const socialImage = event.featuredImage ?? event.image

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
            >
              <Stack space={3}>
                <Inline space={ICON_TEXT_SPACE}>
                  <Icon color="blue400" icon={'calendar'} type="outline"></Icon>
                  <Text>{formattedDate}</Text>
                </Inline>
                <Inline space={ICON_TEXT_SPACE}>
                  <Icon color="blue400" icon={'time'} type="outline"></Icon>
                  <Text>
                    {event.time.startTime as string}
                    {
                      n(
                        'timeSuffix',
                        activeLocale === 'is' ? ' til ' : ' to ',
                      ) as string
                    }
                    {event.time.endTime as string}
                  </Text>
                </Inline>
                <Inline space={ICON_TEXT_SPACE}>
                  <Icon color="blue400" icon="home" type="outline"></Icon>
                  <Box>
                    <Text>
                      {event.location?.streetAddress}
                      {', '}
                      {event.location?.floor
                        ? event.location?.floor + ', '
                        : ''}
                    </Text>
                    <Text>{event.location?.postalCode}</Text>
                  </Box>
                </Inline>
              </Stack>
            </Box>
          </GridColumn>
        </GridRow>
        <GridColumn span={'12/12'}>
          <Text>
            {webRichText(event.content ?? [], undefined, activeLocale)}
          </Text>
        </GridColumn>
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
