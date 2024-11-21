import { Box, Stack } from '@island.is/island-ui/core'
import { SliceMachine } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { StandaloneLayout } from '@island.is/web/layouts/standalone/standalone'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'

type StandaloneHomeScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface StandaloneHomeProps {
  organizationPage: OrganizationPage
}

const StandaloneHome: Screen<
  StandaloneHomeProps,
  StandaloneHomeScreenContext
> = ({ organizationPage }) => {
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
            <Box
              background={index === 0 ? 'dark100' : undefined}
              paddingTop={index === 0 ? 6 : undefined}
            >
              <SliceMachine
                key={slice.id}
                slice={slice}
                slug={organizationPage.slug}
                fullWidth={true}
                marginBottom={
                  index === organizationPage.slices.length - 1 ? 5 : 0
                }
              />
            </Box>
          )
        })}
      </Stack>
    </StandaloneLayout>
  )
}

StandaloneHome.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const [slug] = query.slugs as string[]
  const [
    {
      data: { getOrganizationPage },
    },
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: slug,
              lang: locale as ContentLanguage,
            },
          },
        })
      : {
          data: { getOrganizationPage: organizationPage },
        },
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
  }
}

export default StandaloneHome
