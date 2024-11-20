import { Stack } from '@island.is/island-ui/core'
import { SliceMachine } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
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

export interface StandaloneHomeProps {
  organizationPage: OrganizationPage
}

const StandaloneHome: Screen<StandaloneHomeProps> = ({ organizationPage }) => {
  return (
    <StandaloneLayout organizationPage={organizationPage} isFrontpage={true}>
      <Stack space={SLICE_SPACING}>
        {organizationPage?.slices?.map((slice, index) => {
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              slug={organizationPage.slug}
              fullWidth={organizationPage.theme === 'landing_page'}
              marginBottom={
                index === organizationPage.slices.length - 1 ? 5 : 0
              }
            />
          )
        })}
      </Stack>
      <Stack space={SLICE_SPACING}>
        {organizationPage?.bottomSlices?.map((slice, index) => {
          return (
            <SliceMachine
              key={slice.id}
              slice={slice}
              slug={organizationPage.slug}
              fullWidth={true}
              marginBottom={
                index === organizationPage.slices.length - 1 ? 5 : 0
              }
            />
          )
        })}
      </Stack>
    </StandaloneLayout>
  )
}

StandaloneHome.getProps = async ({ apolloClient, locale, query }) => {
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

export default StandaloneHome
