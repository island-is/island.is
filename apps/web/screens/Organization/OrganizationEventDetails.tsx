import type { Locale } from 'locale'
import { useRouter } from 'next/router'
import { Text } from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  OrganizationWrapper,
  getThemeConfig,
} from '@island.is/web/components'
import {
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
  QueryGetSingleEventArgs,
  Event as EventModel,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getOrganizationSidebarNavigationItems } from '@island.is/web/utils/organization'
import { GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { webRichText } from '@island.is/web/utils/richText'
import { useI18n } from '@island.is/web/i18n'
import { GET_SINGLE_EVENT_QUERY } from '../queries/Events'

interface OrganizationDetailsProps {
  organizationPage: OrganizationPage
  event: EventModel
}

const OrganizationDetails: Screen<OrganizationDetailsProps> = ({
  organizationPage,
  event,
}) => {
  const router = useRouter()
  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const { activeLocale } = useI18n()

  return (
    <>
      <OrganizationWrapper
        organizationPage={organizationPage}
        navigationData={{
          title: 'Efnisyfirlit', // TODO: add namespace
          items: getOrganizationSidebarNavigationItems(
            organizationPage,
            baseRouterPath,
          ),
        }}
        pageTitle={event.title}
      >
        <Text variant="h1" as="h1">
          {event.title}
        </Text>
        <Text>{event.intro}</Text>
        <Text>{webRichText(event.content ?? [], undefined, activeLocale)}</Text>
      </OrganizationWrapper>
      <HeadWithSocialSharing
        title={`${event.title ?? ''} | ${organizationPage.title}`}
        description={event.intro ?? ''}
        imageUrl={event.featuredImage?.url}
        imageWidth={event.featuredImage?.width.toString()}
        imageHeight={event.featuredImage?.height.toString()}
      />
    </>
  )
}

OrganizationDetails.getProps = async ({ apolloClient, query, locale }) => {
  console.log(query)
  const [organizationPageResponse, eventResponse] = await Promise.all([
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
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationDetails)
