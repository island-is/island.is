import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Sticky } from '../../components'

interface ArticleProps {
  sidebar: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <GridContainer>
    <Box paddingBottom={10}>
      <GridRow>
        <GridColumn span={7} offset={1}>
          <Box paddingBottom={10}>{children}</Box>
        </GridColumn>
        <GridColumn span={3} offset={1}>
          <Sticky>{sidebar}</Sticky>
        </GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)

export default ArticleLayout
