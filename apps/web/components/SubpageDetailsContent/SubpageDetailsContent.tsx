import React, { FC, ReactNode } from 'react'
import { Box, GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'

interface SubpageDetailsProps {
  header: ReactNode
  content: ReactNode
  paddingBottom?: ResponsiveSpace
}

export const SubpageDetailsContent: FC<SubpageDetailsProps> = ({
  header,
  content,
  paddingBottom,
}) => {
  return (
    <GridContainer>
      <Box paddingBottom={paddingBottom}>{header}</Box>
      {content}
    </GridContainer>
  )
}
