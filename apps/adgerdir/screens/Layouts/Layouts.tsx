import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './Layouts.treat'

interface ArticleProps {
  sidebar: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <div className={styles.layout}>
    <GridContainer>
      <Box paddingTop={10}>
        <GridRow>
          <GridColumn span={8} offset={1}>
            <Box paddingBottom={10}>{children}</Box>
          </GridColumn>
          <GridColumn span={3}>{sidebar}</GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  </div>
)

export default ArticleLayout
