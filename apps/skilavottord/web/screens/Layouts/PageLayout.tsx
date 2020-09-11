import React, { ReactNode, FC } from 'react'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

interface PageProps {
  children: ReactNode
  isProcess?: boolean
}

export const PageLayout: FC<PageProps> = ({ children, isProcess }) => (
  <Box paddingY={10} background={isProcess ? "purple100" : "white"}>
    <GridContainer>
      <GridRow>
        <GridColumn span={["12/12", "12/12", "7/12", "7/12"]} offset={["0", "0", "1/12", "1/12"]}>
          <Box>{children}</Box>
        </GridColumn>
        <GridColumn span={["0", "0", "3/12", "3/12"]} offset={["0", "0", "1/12", "1/12"]}></GridColumn>
      </GridRow>
    </GridContainer>
  </Box>
)
