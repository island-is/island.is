import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Main, Sticky } from '../../components'

interface ArticleProps {
  sidebar: ReactNode
}

export const ArticleLayout: FC<ArticleProps> = ({ sidebar, children }) => (
  <GridContainer>
    <Box paddingY={[2, 2, 10]}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '8/12', '8/12', '9/12']}>
          {sidebar && <Main>{children}</Main>}
          {!sidebar && <Box>{children}</Box>}
        </GridColumn>
        <GridColumn hiddenBelow="md" span={['0', '0', '4/12', '4/12', '3/12']}>
          {sidebar && (
            <Box printHidden height="full">
              <Sticky>{sidebar}</Sticky>
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </Box>
  </GridContainer>
)

interface SubpageProps {
  main: ReactNode
  details?: ReactNode
}

export const SubpageLayout: FC<SubpageProps> = ({ main, details }) => {
  return (
    <Box width="full" paddingTop={10}>
      <Box paddingBottom={6}>
        <GridContainer>{main}</GridContainer>
      </Box>
      {details && (
        <Box background="blue100" paddingTop={4}>
          <GridContainer>{details}</GridContainer>
        </Box>
      )}
    </Box>
  )
}

export default ArticleLayout
