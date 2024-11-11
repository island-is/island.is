import {
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import StandaloneLayout from './StandaloneLayout/StandaloneLayout'

interface HomeProps {
  organizationPage: OrganizationPage
}

const Home: Screen<HomeProps> = ({ organizationPage }) => {
  return (
    <StandaloneLayout organizationPage={organizationPage}>
      Home
    </StandaloneLayout>
  )
}

Home.getProps = async ({ apolloClient, locale, query }) => {
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
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
  }
}

export default Home
