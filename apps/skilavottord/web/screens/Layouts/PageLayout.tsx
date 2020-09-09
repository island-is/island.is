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
  <Box paddingY={10}>
    <GridContainer>
      <GridRow>
        <GridColumn span="7/12" offset="1/12">
          <Box>{children}</Box>
        </GridColumn>
        <GridColumn span="3/12" offset="1/12"></GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)
