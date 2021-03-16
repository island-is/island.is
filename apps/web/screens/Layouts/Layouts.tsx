import React, { FC, ReactNode } from 'react'
import { Box, GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'
import { NoChildren } from '@island.is/web/types'

interface SubpageProps {
  main: ReactNode
  details?: ReactNode
  paddingTop?: ResponsiveSpace
  mainPaddingBottom?: ResponsiveSpace
}

export const SubpageLayout: FC<SubpageProps & NoChildren> = ({
  main,
  details,
  paddingTop,
  mainPaddingBottom,
}) => {
  return (
    <Box width="full" paddingTop={paddingTop} id="main-content">
      <Box paddingBottom={mainPaddingBottom}>
        <GridContainer>{main}</GridContainer>
      </Box>
      {details && (
        <Box background="blue100" paddingTop={[3, 3, 5]}>
          <GridContainer>{details}</GridContainer>
        </Box>
      )}
    </Box>
  )
}

export default SubpageLayout
