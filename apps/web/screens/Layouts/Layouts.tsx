import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Sticky } from '../../components'

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
    <Box paddingY={[2, 2, 10]}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '4/12', '3/12']} hideBelow="md">
          <Sticky>{sidebar}</Sticky>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '8/12']}
          offset={['0', '0', '0', '1/12']}
        >
          <Box paddingBottom={[5, 5, 10]}>{children}</Box>
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
    <Box paddingY={[2, 2, 10]}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '9/12']}>
          <Box>{children}</Box>
        </GridColumn>
        <GridColumn
          hideBelow="md"
          span={['0', '0', '3/12']}
        >
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
    <Box paddingTop={[2, 2, 6]} paddingBottom={[5, 5, 10]}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '4/12', '3/12']} hideBelow="md">
          <Sticky>
            <Box background="purple100" padding={4}>
              {sidebar}
            </Box>
          </Sticky>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '8/12', '6/12']}
          offset={['0', '0', '0', '1/12']}
        >
          <Box paddingBottom={[5, 5, 10]}>{children}</Box>
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
    <Box paddingY={[2, 2, 10]}>
      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '8/12', '7/12']}
          offset={['0', '0', '0', '1/12']}
        >
          {children}
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '4/12', '3/12']}
          offset={['0', '0', '0', '1/12']}
        >
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
