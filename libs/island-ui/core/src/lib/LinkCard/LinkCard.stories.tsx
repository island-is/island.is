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
}

export const Default = () => (
  <GridContainer>
    <GridRow>
      <GridColumn span="6/12">
        <Box padding={2}>
          <FocusableBox href="/">
            <LinkCard tag="Has a tag">Wrapped with FocusableBox</LinkCard>
          </FocusableBox>
        </Box>
      </GridColumn>
    </GridRow>
  </GridContainer>
)
