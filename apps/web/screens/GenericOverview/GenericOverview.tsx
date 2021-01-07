import React from 'react'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  Breadcrumbs,
  Stack,
  Text,
  Box,
  Navigation,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { Document } from '@contentful/rich-text-types'
import { renderHtml } from '@island.is/island-ui/contentful'
import { GET_GENERIC_OVERVIEW_PAGE_QUERY } from '@island.is/web/screens/queries'
import {
  GetGenericOverviewPageQuery,
  QueryGetGenericOverviewPageArgs,
} from '@island.is/web/graphql/schema'

interface GenericOverviewProps {
  genericOverviewPage: GetGenericOverviewPageQuery['getGenericOverviewPage']
}

export const GenericOverview: Screen<GenericOverviewProps> = ({
  genericOverviewPage: { title, intro, navigation },
}) => {
  return (
    <SidebarLayout
      sidebarContent={
        <Navigation
          baseId="desktopNav"
          items={[]}
          title={navigation.title}
          titleLink={{ href: `/throun`, active: true }}
        />
      }
    >
      <GridRow>
        <GridColumn
          offset={[null, null, null, '1/9']}
          span={['12/12', '12/12', '12/12', '8/9']}
        >
          <Stack space={2}>
            <Breadcrumbs
              items={[
                {
                  title: 'Ísland.is',
                  href: '/',
                },

                {
                  title: navigation.title,
                  href: '/throun',
                },
              ]}
            />
            <Box display={['block', 'block', 'none']}>
              <Navigation
                baseId={'mobileNav'}
                isMenuDialog
                activeItemTitle={navigation.title}
                items={[]}
                title={navigation.title}
                titleLink={{ href: `/throun`, active: true }}
              />
            </Box>

            <Text variant="h1" as="h1">
              {title}
            </Text>

            {Boolean(intro) && (
              <Box>{renderHtml(intro.document as Document)}</Box>
            )}
          </Stack>
        </GridColumn>
      </GridRow>
    </SidebarLayout>
  )
}

GenericOverview.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getGenericOverviewPage: genericOverviewPage },
    },
  ] = await Promise.all([
    apolloClient.query<
      GetGenericOverviewPageQuery,
      QueryGetGenericOverviewPageArgs
    >({
      query: GET_GENERIC_OVERVIEW_PAGE_QUERY,
      fetchPolicy: 'no-cache',
      variables: {
        input: { lang: locale, pageIdentifier: 'throun' },
      },
    }),
  ])

  if (!genericOverviewPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return { genericOverviewPage }
}

export default withMainLayout(GenericOverview)
