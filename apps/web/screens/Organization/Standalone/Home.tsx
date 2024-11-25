import { useMemo } from 'react'

import { Box, Stack } from '@island.is/island-ui/core'
import { renderSlice } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
import {
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { StandaloneLayout } from '@island.is/web/layouts/organization/standalone'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import * as styles from './Home.css'

type StandaloneHomeScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface StandaloneHomeProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
}

const StandaloneHome: Screen<
  StandaloneHomeProps,
  StandaloneHomeScreenContext
> = ({ organizationPage, namespace }) => {
  const organizationNamespace = useMemo(() => {
    return JSON.parse(organizationPage.organization?.namespace?.fields || '{}')
  }, [organizationPage.organization?.namespace?.fields])

  const n = useNamespace(organizationNamespace)

  return (
    <StandaloneLayout
      organizationPage={organizationPage}
      isFrontpage={true}
      bannerTitle={n('bannerTitle', '')}
    >
      <Stack space={SLICE_SPACING}>
        <Stack space={SLICE_SPACING}>
          {organizationPage.slices.map((slice) => {
            return (
              <Box
                key={slice.id}
                className={styles.slicesContainer}
                paddingX={
                  slice.__typename !== 'LatestNewsSlice' ? [3, 3, 6] : undefined
                }
              >
                {renderSlice(slice, namespace, organizationPage.slug, {})}
              </Box>
            )
          })}
        </Stack>
        <Stack space={SLICE_SPACING}>
          {organizationPage.bottomSlices.map((slice, index) => {
            return (
              <Box
                key={slice.id}
                background={index === 0 ? 'dark100' : undefined}
                paddingTop={index === 0 ? 5 : undefined}
              >
                {renderSlice(slice, namespace, organizationPage.slug, {})}
              </Box>
            )
          })}
        </Stack>
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
  const [slug] = (query.slugs ?? []) as string[]

  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
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
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields || '{}')
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
  }
}

export default StandaloneHome
