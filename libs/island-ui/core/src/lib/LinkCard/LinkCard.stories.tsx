import React from 'react'

import { Box } from '../Box/Box'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { LinkCard } from './LinkCard'

export default {
  title: 'Components/LinkCard',
  component: LinkCard,
  parameters: {
    docs: {
      description: {
        component:
          'Used to display columns of links that optionally include a tag',
      },
    },
  },
}

export const Default = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span="8/12">
        <Box paddingY={1}>
          <FocusableBox href="/">
            <LinkCard tag="Has a tag">Wrapped with FocusableBox</LinkCard>
          </FocusableBox>
        </Box>
      </GridColumn>
    </GridRow>
    <GridRow>
      <GridColumn span="8/12">
        <Box paddingY={1}>
          <FocusableBox href="/">
            <LinkCard tag="Another one" tagVariant="darkerMint">
              Another one
            </LinkCard>
          </FocusableBox>
        </Box>
      </GridColumn>
    </GridRow>
  </GridContainer>
)
