import React, { ReactNode } from 'react'
import { Box, ContentBlock, Columns, Column } from '@island.is/island-ui/core'

interface PropTypes {
  left: ReactNode
  right?: ReactNode
}

function Layout({ left, right }: PropTypes) {
  return (
    <Box paddingX="gutter">
      <ContentBlock>
        <Columns align="right" space="gutter" collapseBelow="lg">
          <Column width="7/12">{left}</Column>
          <Column width="4/12">
            <Box paddingLeft={[0, 0, 0, 8, 15]} width="full">
              {right}
            </Box>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default Layout
