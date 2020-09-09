import React, { ReactNode, FC } from 'react'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

interface PageProps {
  children: ReactNode
}

export const PageLayout: FC<PageProps> = ({ children }) => (
  <GridContainer>
    <Box padding={10}>
      <GridRow>
        <GridColumn span="8/12">
          <Box>{children}</Box>
        </GridColumn>
        <GridColumn span="4/12"></GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)
