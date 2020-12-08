import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

interface SubpageDetailsProps {
  header: ReactNode
  content: ReactNode
}

export const SubpageDetailsContent: FC<SubpageDetailsProps> = ({
  header,
  content,
}) => {
  return (
    <Box>
      <Box paddingBottom={4}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">{header}</GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">{content}</GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </Box>
  )
}
