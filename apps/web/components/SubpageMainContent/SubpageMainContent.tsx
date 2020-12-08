import React, { FC, ReactNode } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
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
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])
  
  return (
    <Box>
      {isMobile ? (
        <GridContainer>
          {main}
        </GridContainer>
      ) : (
        <Box>
          {image ? (
            <GridContainer>
              <GridRow>
                <GridColumn span="9/12">{main}</GridColumn>
                <GridColumn span="3/12">{image}</GridColumn>
              </GridRow>
            </GridContainer>
          ) : (
            <GridContainer>
              {main}
            </GridContainer>
          )}
        </Box>
      )}
    </Box>
  )
}
