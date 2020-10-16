import React from 'react'
import { Box } from '../Box/Box'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { TopicCard } from './TopicCard'

export default {
  title: 'Cards/TopicCard',
  component: TopicCard,
  parameters: {
    docs: {
      description: {
        component:
          'The component formerly known as LinkCard. Clickable card with an optional tag.',
      },
    },
  },
}

export const Default = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span="8/12">
        <Box paddingY={1}>
          <TopicCard>Default with no tag</TopicCard>
        </Box>
      </GridColumn>
    </GridRow>
    <GridRow>
      <GridColumn span="8/12">
        <Box paddingY={1}>
          <TopicCard tag="Has a tag" colorScheme="blue">
            Blue variant (which is default)
          </TopicCard>
        </Box>
      </GridColumn>
    </GridRow>
    <GridRow>
      <GridColumn span="8/12">
        <Box paddingY={1}>
          <TopicCard tag="Another one" colorScheme="red">
            Red variant
          </TopicCard>
        </Box>
      </GridColumn>
    </GridRow>
  </GridContainer>
)
