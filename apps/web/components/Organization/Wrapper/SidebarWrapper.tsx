import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './SidebarWrapper.treat'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface SidebarWrapperProps {
  sidebarContent: ReactNode
  hideSidebarInMobile?: boolean
  fullWidthContent?: boolean
}

export const SidebarWrapper: FC<SidebarWrapperProps> = ({
  sidebarContent,
  hideSidebarInMobile = false,
  fullWidthContent = false,
  children,
}) => {
  const isMobile = useWindowSize().width < theme.breakpoints.md

  return (
    <GridContainer position="none">
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        height="full"
        paddingBottom={6}
      >
        <Box
          printHidden
          className={styles.sidebarWrapper}
          display={
            hideSidebarInMobile ? ['none', 'none', 'block'] : ['block', 'block']
          }
        >
          {sidebarContent}
        </Box>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '0', '1/9']}
              span={[
                '9/9',
                '9/9',
                '9/9',
                '9/9',
                fullWidthContent ? '9/9' : '7/9',
              ]}
            >
              <Box
                paddingLeft={[0, 0, 6, 6, 0]}
                paddingTop={hideSidebarInMobile ? 0 : [4, 4, 0]}
              >
                {children}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </GridContainer>
  )
}
