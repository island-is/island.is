import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'

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
  Link,
  Button,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { GET_GENERIC_OVERVIEW_PAGE_QUERY } from '@island.is/web/screens/queries'
import {
  GetGenericOverviewPageQuery,
  QueryGetGenericOverviewPageArgs,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'
import {
  Image,
  Slice as SliceType,
  richText,
} from '@island.is/island-ui/contentful'

function Car() {
    return (
        <div className="Car">
          <h3>Iframes in React</h3>
          <iframe frameBorder="0" width="100%" height="1500px" src="https://islandis.featureupvote.com/"></iframe>
        </div>
      );
  }
const title = "Óskalisti þjóðarinnar"

const renderNavigation = (isMobile: boolean) => {
    return (
      <Navigation
        baseId={isMobile ? 'mobileNav' : 'desktopNav'}
        isMenuDialog={isMobile}
        activeItemTitle={title}
        title={title}
        items={[]}
        renderLink={(link, { typename, slug }) => {
          return (
            <Link href="">{link}</Link>
          )
        }}
      />
    )
  }


function Stuff() {
   
    return (
        <SidebarLayout sidebarContent={renderNavigation(false)}>
          <Stack space={2}>
            <Box display={['none', 'none', 'inlineBlock']}>
              <Breadcrumbs
                items={[
                  {
                    title: 'Ísland.is',
                    href: '/',
                  },
                  {
                    title: title,
                  },
                ]}
              />
            </Box>
            <Box display={['block', 'block', 'none']}>{renderNavigation(true)}</Box>
            <Text variant="h1" as="h1">
              {title}
            </Text>
            <iframe frameBorder="0" width="100%" height="1500px" src="https://islandis.featureupvote.com/"></iframe>

          </Stack>
          
        </SidebarLayout>
      )
}

  
const screen = withMainLayout(Stuff)

export default withApollo(withLocale('is')(screen))
