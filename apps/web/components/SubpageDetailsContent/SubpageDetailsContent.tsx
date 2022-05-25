import React, { ReactNode } from 'react'
import { Box, ResponsiveSpace } from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/web/components'

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
