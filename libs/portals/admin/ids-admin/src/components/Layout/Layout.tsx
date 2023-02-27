import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Stack,
} from '@island.is/island-ui/core'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  navTitle: string
  navItems: PortalNavigationItem
}

const Layout: React.FC<LayoutProps> = ({ children, navTitle, navItems }) => {
  return (
    <GridContainer>
      <Hidden above="md">
        <Box paddingBottom={4}>
          <PortalNavigation
            title={navTitle}
            navigation={navItems as PortalNavigationItem}
          />
        </Box>
      </Hidden>
      <GridRow rowGap={'gutter'}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12', '3/12']}
          order={[2, 2, 2, 0]}
        >
          <Stack space={3}>
            <Hidden below="lg">
              <PortalNavigation title={navTitle} navigation={navItems} />
            </Hidden>
          </Stack>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '8/12', '9/12']}
          order={[2, 2, 2, 0]}
        >
          <Box
            marginLeft={[0, 'smallGutter', 'gutter', 'containerGutter']}
            marginRight={[0, 'smallGutter', 'gutter', 'gutter']}
          >
            {children}
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Layout
