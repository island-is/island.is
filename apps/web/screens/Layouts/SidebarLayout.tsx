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
  absolute?: boolean
  hiddenBelow?: Exclude<Breakpoint, 'xs'>
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  absolute,
  hiddenBelow,
  children,
}) => (
  <GridContainer position="none">
    <Box
      display="flex"
      flexDirection="row"
      height="full"
      paddingBottom={6}
      style={{
        position: Boolean(absolute) ? undefined : 'relative',
      }}
    >
      <Hidden
        print
        position={Boolean(absolute) ? 'none' : 'relative'}
        below={hiddenBelow}
      >
        <Box
          className={cn(
            styles.sidebarWrapper,
            Boolean(absolute) ? styles.absolute : styles.sticky,
          )}
        >
          {sidebarContent}
        </Box>
      </Hidden>
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
