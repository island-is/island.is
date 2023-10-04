import type { Locale } from 'locale'
import { getThemeConfig } from '@island.is/web/components'
import {
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { CustomNextError } from '@island.is/web/units/errors'

interface OrganizationDetailsProps {
  organizationPage: OrganizationPage
}

const OrganizationDetails: Screen<OrganizationDetailsProps> = ({
  organizationPage,
}) => {
  return <div>Event details</div>
}

OrganizationDetails.getProps = async ({ apolloClient, query, locale }) => {
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

  return {
    organizationPage,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationDetails)
