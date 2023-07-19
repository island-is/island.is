import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import React from 'react'
import {
  Breadcrumbs,
  Stack,
  Text,
  Box,
  Navigation,
  Link,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

const title = 'Óskalisti þjóðarinnar'

const renderNavigation = (isMobile: boolean) => {
  return (
    <Navigation
      baseId={isMobile ? 'mobileNav' : 'desktopNav'}
      isMenuDialog={isMobile}
      activeItemTitle={title}
      title={title}
      items={[]}
      renderLink={(link, { typename, slug }) => {
        return <Link href="">{link}</Link>
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
        <iframe
          frameBorder="0"
          scrolling="no"
          width="100%"
          height="2500px"
          src="https://islandis.featureupvote.com/"
        ></iframe>
      </Stack>
    </SidebarLayout>
  )
}

export default withApollo(withLocale('is')(withMainLayout(Stuff)))
