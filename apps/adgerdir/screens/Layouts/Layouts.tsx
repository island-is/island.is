import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Hidden,
} from '@island.is/island-ui/core'

import { Sticky } from '@island.is/adgerdir/components'

interface ArticleProps {
  sidebar?: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <GridContainer>
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
  </GridContainer>
)

interface NewsListProps {
  sidebar: ReactNode
}

export const NewsListLayout: FC<NewsListProps> = ({ sidebar, children }) => (
  <GridContainer>
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '4/12', '3/12']}>
        <Sticky>
          <Hidden below="lg">{sidebar}</Hidden>
        </Sticky>
      </GridColumn>
      <GridColumn
        span={['12/12', '12/12', '12/12', '7/12']}
        offset={[null, null, null, '1/12']}
      >
        <Box paddingBottom={10}>{children}</Box>
      </GridColumn>
    </GridRow>
  </GridContainer>
)
