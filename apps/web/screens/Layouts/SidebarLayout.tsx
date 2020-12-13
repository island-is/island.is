import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './SidebarLayout.treat'
import cn from 'classnames'

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
        className={cn(styles.sidebarWrapper, { [styles.sticky]: isSticky })}
        display={
          hiddenOnTablet
            ? ['none', 'none', 'none', 'block']
            : ['none', 'none', 'block']
        }
      >
        {sidebarContent}
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn span={'12/12'}>
            <Box paddingLeft={[0, 0, 4, 6]}>{children}</Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  </GridContainer>
)

export default SidebarLayout
