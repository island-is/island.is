import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Hidden,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './SidebarLayout.treat'
import cn from 'classnames'
type Breakpoint = keyof typeof theme['breakpoints']

interface SidebarLayoutProps {
  sidebarContent: ReactNode
  isSticky?: boolean
  hiddenOnTablet?: boolean
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  hiddenOnTablet = false,
  children,
}) => (
  <GridContainer position="none">
    <Box
      display="flex"
      flexDirection="row"
      height="full"
      paddingBottom={6}
      position={isSticky ? 'relative' : undefined}
    >
      <Box
        printHidden
        className={cn(styles.sidebarWrapper, isSticky ? styles.sticky : null)}
        display={
          hiddenOnTablet
            ? ['none', 'none', 'none', 'block', 'block']
            : ['none', 'none', 'block', 'block', 'block']
        }
      >
        {sidebarContent}
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn span={'12/12'}>
            <Box paddingLeft={[0, 2, 4, 6, 6]}>{children}</Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  </GridContainer>
)

export default SidebarLayout
