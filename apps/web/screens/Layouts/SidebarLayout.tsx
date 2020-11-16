import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Hidden,
} from '@island.is/island-ui/core'
import { Sticky } from '../../components'

interface SidebarLayoutProps {
  sidebarContent: ReactNode
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  sidebarContent,
  children,
}) => (
  <GridContainer>
    <Box display="flex" flexDirection="row" height="full" position="relative">
      <Sticky childOfFlexBox constantSticky>
        <Hidden print below="md">
          {sidebarContent}
        </Hidden>
      </Sticky>
      <GridContainer>
        <GridRow>
          <GridColumn span={'12/12'}>
            <Box paddingLeft={6} paddingBottom={6}>
              {children}
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  </GridContainer>
)

export const FullScreenLayout: FC = ({ children }) => (
  <GridContainer>
    <Box display="flex" flexDirection="row">
      <GridContainer>
        <GridRow>
          <GridColumn span={'12/12'}>{children}</GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  </GridContainer>
)

export default SidebarLayout
