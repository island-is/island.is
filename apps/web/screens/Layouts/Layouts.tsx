import React, { FC, ReactNode } from 'react'
import { Box, GridContainer } from '@island.is/island-ui/core'

interface SubpageProps {
  main: ReactNode
  details?: ReactNode
}

export const SubpageLayout: FC<SubpageProps> = ({ main, details }) => {
  return (
    <Box width="full" paddingTop={10} id="main-content">
      <Box paddingBottom={6}>
        <GridContainer>{main}</GridContainer>
      </Box>
      {details && (
        <Box background="blue100" paddingTop={4}>
          <GridContainer>{details}</GridContainer>
        </Box>
      )}
    </Box>
  )
}

export default SubpageLayout
