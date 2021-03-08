import React, { FC, ReactNode } from 'react'
import { Box, GridContainer, ResponsiveSpace } from '@island.is/island-ui/core'
import { Main } from '@island.is/web/components'

interface SubpageProps {
  main: ReactNode
  details?: ReactNode
  paddingTop?: ResponsiveSpace
  mainPaddingBottom?: ResponsiveSpace
  addMainLandmark?: boolean
}

export const SubpageLayout: FC<SubpageProps> = ({
  main,
  details,
  paddingTop,
  mainPaddingBottom,
  addMainLandmark = false,
}) => {
  return (
    <Main addLandmark={addMainLandmark}>
      <Box width="full" paddingTop={paddingTop}>
        <Box paddingBottom={mainPaddingBottom}>
          <GridContainer>{main}</GridContainer>
        </Box>
        {details && (
          <Box background="blue100" paddingTop={[3, 3, 5]}>
            <GridContainer>{details}</GridContainer>
          </Box>
        )}
      </Box>
    </Main>
  )
}

export default SubpageLayout
