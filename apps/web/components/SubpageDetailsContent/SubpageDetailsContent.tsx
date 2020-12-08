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
    <GridContainer>
      <Box paddingBottom={4}>
        {header}
      </Box>
      {content}
    </GridContainer>
  )
}
