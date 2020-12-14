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
  fullWidthContent?: boolean
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  hiddenOnTablet = false,
  fullWidthContent = false,
  children,
}) => (
  <Box paddingTop={[0, 0, 8]}>
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
            <GridColumn
              offset={fullWidthContent ? '0' : ['0', '0', '0', '0', '1/9']}
              span={[
                '9/9',
                '9/9',
                '9/9',
                '9/9',
                fullWidthContent ? '9/9' : '7/9',
              ]}
            >
              <Box paddingLeft={[0, 0, hiddenOnTablet ? 0 : 6, 6, 0]}>
                {children}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </GridContainer>
  </Box>
)

export default SidebarLayout
