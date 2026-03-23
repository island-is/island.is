import React, { FC, ReactNode, useState, useEffect } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { Features } from '@island.is/feature-flags'

import * as styles from './SidebarLayout.css'
import cn from 'classnames'
import { useWindowSize } from 'react-use'
import { XL_SCREEN_WIDTH } from '../../lib/constants'

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
  const { width } = useWindowSize()
  const isXLScreen = width > XL_SCREEN_WIDTH
  const featureFlagClient = useFeatureFlagClient()
  const [useGridLayout, setUseGridLayout] = useState(false)

  useEffect(() => {
    featureFlagClient
      .getValue(Features.isServicePortalSidebarGridLayoutEnabled, false)
      .then((value) => setUseGridLayout(value as boolean))
  }, [featureFlagClient])

  if (useGridLayout) {
    return (
      <Box paddingTop={[0, 0, 9]} position={isSticky ? 'relative' : undefined}>
        <GridContainer position="none">
          <GridRow>
            <GridColumn
              span="3/12"
              className={cn(styles.sidebarColumn, {
                [styles.stickyGrid]: isSticky,
              })}
            >
              <Box printHidden>{sidebarContent}</Box>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
              <Box paddingLeft={[0, 0, 3, 6]}>{children}</Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    )
  }

  // Legacy flex layout (default, unchanged)
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
