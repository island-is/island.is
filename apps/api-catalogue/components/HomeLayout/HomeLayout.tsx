import React, { ReactNode } from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  ContentBlock,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

interface PropTypes {
  left: ReactNode
  right?: ReactNode
}

function HomeLayout({ left, right }: PropTypes) {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Box paddingX="gutter">
      <ContentBlock>
        <GridContainer>
          <GridRow>
            <GridColumn
              span={isMobile ? '11/12' : '5/12'}
              offset={isMobile ? '0' : '1/12'}
            >
              {left}
            </GridColumn>
            <GridColumn
              span={isMobile ? '0' : '5/12'}
              offset={isMobile ? '0' : '1/12'}
            >
              <Box paddingLeft={[0, 0, 0, 8, 15]} width="full">
                {right}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </ContentBlock>
    </Box>
  )
}

export default HomeLayout
