import type { FC, ReactNode } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'

interface LayoutProps {
  children: ReactNode
  navTitle: string
  navItems: PortalNavigationItem
}

export const Layout: FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  navTitle,
  navItems,
}) => (
  <GridContainer>
    <Hidden above="md">
      <Box paddingBottom={4}>
        <PortalNavigation title={navTitle} navigation={navItems} />
      </Box>
    </Hidden>
    <GridRow rowGap={'gutter'}>
      <GridColumn
        span={['12/12', '12/12', '12/12', '4/12', '3/12']}
        order={[2, 2, 2, 0]}
      >
        <Box position="sticky" top={4}>
          <Hidden below="lg">
            <PortalNavigation title={navTitle} navigation={navItems} />
          </Hidden>
        </Box>
      </GridColumn>
      <GridColumn
        span={['12/12', '12/12', '12/12', '8/12']}
        offset={['0', '0', '0', '0', '1/12']}
        order={[2, 2, 2, 0]}
      >
        {children}
      </GridColumn>
    </GridRow>
  </GridContainer>
)
