import React, { FC, ReactNode } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'

import * as styles from './SidebarWrapper.css'

interface SidebarWrapperProps {
  sidebarContent: ReactNode
  hideSidebarInMobile?: boolean
  fullWidthContent?: boolean
}

export const SidebarWrapper: FC<
  React.PropsWithChildren<SidebarWrapperProps>
> = ({
  sidebarContent,
  hideSidebarInMobile = false,
  fullWidthContent = false,
  children,
}) => {
  return (
    <GridContainer position="none">
      <Box
        display="flex"
        flexDirection={['column', 'column', 'row']}
        height="full"
        paddingBottom={6}
      >
        <Box
          printHidden
          className={styles.sidebarWrapper}
          display={hideSidebarInMobile ? ['none', 'none', 'block'] : 'block'}
        >
          {sidebarContent}
        </Box>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '1/9']}
              span={[
                '9/9',
                '9/9',
                '9/9',
                '8/9',
                fullWidthContent ? '8/9' : '7/9',
              ]}
            >
              <Box
                paddingLeft={[0, 0, 6, 6, 3]}
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
