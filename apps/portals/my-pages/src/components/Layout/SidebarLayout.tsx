import React, { CSSProperties, FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './SidebarLayout.css'
import cn from 'classnames'
import { useWindowSize } from 'react-use'
import { XL_SCREEN_WIDTH } from '../../lib/constants'

interface SidebarLayoutProps {
  children: ReactNode
  sidebarContent: ReactNode
  isSticky?: boolean
  /** Height of the fixed alert/delegation banners above the header. */
  offsetTop?: number
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  offsetTop = 0,
  children,
}) => {
  const { width } = useWindowSize()
  const isXLScreen = width > XL_SCREEN_WIDTH

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
            component="aside"
            printHidden
            className={cn(styles.sidebarWrapper, { [styles.sticky]: isSticky })}
            // Cast needed: BoxProps inherits AllHTMLAttributes, so style is
            // CSSProperties, which has no index signature for custom properties.
            style={
              {
                marginTop: offsetTop,
                '--mp-sidebar-offset': `${offsetTop}px`,
              } as CSSProperties
            }
          >
            {sidebarContent}
          </Box>
          <GridContainer className={styles.sidebarWrap}>
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
