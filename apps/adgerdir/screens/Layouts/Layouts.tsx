import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import * as styles from './Layouts.treat'

interface ArticleProps {
  sidebar?: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <div className={styles.layout}>
    <GridContainer>
      <Box marginX={[1, 1, 1, 1, 2]} paddingTop={10}>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12', '7/12']}
            offset={[null, null, null, null, '1/12']}
          >
            <Box paddingBottom={10}>{children}</Box>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '4/12', '3/12']}
            offset={[null, null, null, null, '1/12']}
          >
            {sidebar}
          </GridColumn>
        </GridRow>
      </Box>
    </GridContainer>
  </div>
)

interface NewsListProps {
  sidebar: ReactNode
}

export const NewsListLayout: FC<NewsListProps> = ({ sidebar, children }) => (
  <GridContainer>
    <Box paddingTop={6} paddingBottom={10}>
      <GridRow>
        <GridColumn span="4/12">
          <Box background="purple100" padding={4}>
            {sidebar}
          </Box>
        </GridColumn>
        <GridColumn span="6/12" offset="1/12">
          <Box paddingBottom={10}>{children}</Box>
        </GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)
