import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './SidebarLayout.css'
import cn from 'classnames'

interface SidebarLayoutProps {
  children: ReactNode
  sidebarContent: ReactNode
  isSticky?: boolean
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  children,
}) => (
  <Box paddingTop={[0, 0, 9]}>
    <GridContainer position="none">
      <Box
        display="flex"
        flexDirection="row"
        height="full"
        position={isSticky ? 'relative' : undefined}
      >
        <Box
          printHidden
          className={cn(styles.sidebarWrapper, { [styles.sticky]: isSticky })}
          display={['none', 'none', 'block']}
        >
          {sidebarContent}
        </Box>
        <GridContainer className={styles.sidebarWrap}>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '0', '1/9']}
              span={['9/9', '9/9', '9/9', '9/9', '8/9']}
            >
              <Box paddingLeft={[0, 0, 6, 6, 0]}>{children}</Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </GridContainer>
  </Box>
)

export default SidebarLayout
