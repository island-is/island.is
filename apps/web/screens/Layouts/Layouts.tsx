import React, { FC, ReactNode } from 'react'
import cn from 'classnames'
import {
  ContentBlock,
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Sticky } from '../../components'

import * as styles from './Layouts.treat'

interface CategoryProps {
  sidebar: ReactNode
  belowContent?: ReactNode
}

export const CategoryLayout: FC<CategoryProps> = ({
  sidebar,
  belowContent,
  children,
}) => (
  <GridContainer>
    <Box paddingBottom={10}>
      <GridRow>
        <GridColumn span={3}>
          <Sticky>{sidebar}</Sticky>
        </GridColumn>
        <GridColumn span={6} offset={1}>
          <Box paddingBottom={10}>{children}</Box>
          {belowContent && belowContent}
        </GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)

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

interface NewsListProps {
  sidebar: ReactNode
}

export const NewsListLayout: FC<NewsListProps> = ({ sidebar, children }) => (
  <GridContainer>
    <Box paddingTop={6} paddingBottom={10}>
      <GridRow>
        <GridColumn span={4}>
          <Sticky>
            <Box background="purple100" padding={4}>
              {sidebar}
            </Box>
          </Sticky>
        </GridColumn>
        <GridColumn span={6} offset={1}>
          <Box paddingBottom={10}>{children}</Box>
        </GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)

interface NewsItemProps {
  sidebar: ReactNode
}

export const NewsItemLayout: FC<NewsItemProps> = ({ sidebar, children }) => (
  <GridContainer>
    <Box paddingTop={6} paddingBottom={10}>
      <GridRow>
        <GridColumn span={6} offset={1}>
          {children}
        </GridColumn>
        <GridColumn span={4}>
          <Sticky>
            <Box background="purple100" padding={4}>
              {sidebar}
            </Box>
          </Sticky>
        </GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)

export default ArticleLayout
