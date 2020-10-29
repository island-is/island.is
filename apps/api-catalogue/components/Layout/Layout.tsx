import React, { ReactNode } from 'react'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
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

function Layout({ left, right }: PropTypes) {
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
            <GridColumn span={isMobile ? '10/12' : '7/12'} offset="1/12">
              {left}
            </GridColumn>
            <GridColumn span={isMobile ? '0' : '4/12'}>{right}</GridColumn>
          </GridRow>
        </GridContainer>
      </ContentBlock>
    </Box>
  )
}

export default Layout
