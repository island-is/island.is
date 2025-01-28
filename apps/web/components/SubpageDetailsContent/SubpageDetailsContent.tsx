import React, { ReactNode } from 'react'

import { Box, GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'

interface SubpageDetailsProps {
  header: ReactNode
  content: ReactNode
  paddingBottom?: ResponsiveSpace
}

export const SubpageDetailsContent = ({
  header,
  content,
  paddingBottom,
}: SubpageDetailsProps) => {
  return (
    <GridContainer>
      <Box paddingBottom={paddingBottom}>{header}</Box>
      {content}
    </GridContainer>
  )
}
