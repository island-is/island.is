import { OrganizationWrapper } from '@island.is/web/components'
import {
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'

interface PensionCalculatorProps {
  organizationPage: OrganizationPage
}

const PensionCalculator: Screen<PensionCalculatorProps> = ({
  organizationPage,
}) => {
  const { activeLocale } = useI18n()

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{
        items: [],
        title: '',
      }}
      pageTitle={
        activeLocale === 'is' ? 'Reiknivél lífeyris' : 'Pension calculator'
      }
    ></OrganizationWrapper>
  )
}

PensionCalculator.getProps = async ({ apolloClient, query, locale }) => {
  const [
    {
      data: { getOrganizationPage },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: ${query.slug} was not found`,
    )
  }

  return { organizationPage: getOrganizationPage }
}

export default withMainLayout(PensionCalculator)
