import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

interface SubpageMainProps {
  main: ReactNode
  image?: ReactNode
}

export const SubpageMainContent: FC<SubpageMainProps> = ({ main, image }) => {
  return (
    <Box>
      <GridContainer>
        {!image && (
          <GridRow>
            <GridColumn span="12/12">{main}</GridColumn>
          </GridRow>
        )}
        {image && (
          <GridRow>
            <GridColumn span="9/12">{main}</GridColumn>
            <GridColumn span="3/12">{image}</GridColumn>
          </GridRow>
        )}
      </GridContainer>
    </Box>
  )
}
