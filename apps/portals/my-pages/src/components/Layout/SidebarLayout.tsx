import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './SidebarLayout.css'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'

interface SidebarLayoutProps {
  children: ReactNode
  sidebarContent: ReactNode
  isSticky?: boolean
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  children,
}) => {
  const xlScreenWidth = 1512
  const { width } = useWindowSize()
  const isXLScreen = width > xlScreenWidth
  return (
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
          <GridContainer>
            <GridRow>
              <GridColumn
                offset={isXLScreen ? '1/12' : '0'}
                span={isXLScreen ? '11/12' : '12/12'}
              >
                <Box paddingLeft={[0, 0, 3, 6]}>{children}</Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </GridContainer>
    </Box>
  )
}

export default SidebarLayout
