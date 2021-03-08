import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  ResponsiveSpace,
} from '@island.is/island-ui/core'

import * as styles from './SidebarLayout.treat'
import cn from 'classnames'
import { Main } from '@island.is/web/components'

interface SidebarLayoutProps {
  sidebarContent: ReactNode
  isSticky?: boolean
  hiddenOnTablet?: boolean
  fullWidthContent?: boolean
  addMainLandmark?: boolean
  addAsideLandmark?: boolean
  paddingTop?: ResponsiveSpace
  paddingBottom?: ResponsiveSpace
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  isSticky = true,
  hiddenOnTablet = false,
  fullWidthContent = false,
  addMainLandmark = true,
  addAsideLandmark = true,
  paddingTop = [0, 0, 8],
  paddingBottom = 6,
  children,
}) => (
  <Box paddingTop={paddingTop}>
    <GridContainer position="none">
      <Box
        display="flex"
        flexDirection="row"
        height="full"
        paddingBottom={paddingBottom}
        position={isSticky ? 'relative' : undefined}
      >
        <Box
          component={addAsideLandmark ? 'aside' : 'div'}
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
              <Main addLandmark={addMainLandmark}>
                <Box paddingLeft={[0, 0, hiddenOnTablet ? 0 : 6, 6, 0]}>
                  {children}
                </Box>
              </Main>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </GridContainer>
  </Box>
)

export default SidebarLayout
