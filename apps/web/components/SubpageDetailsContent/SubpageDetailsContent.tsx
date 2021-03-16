import React, { FC, ReactNode } from 'react'
import { Box, GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'
import { NoChildren } from '@island.is/web/types'

interface SubpageDetailsProps {
  header: ReactNode
  content: ReactNode
  paddingBottom?: ResponsiveSpace
}

export const SubpageDetailsContent: FC<SubpageDetailsProps & NoChildren> = ({
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
