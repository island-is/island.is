import React, { ReactNode } from 'react'
import { Box, ContentBlock, Columns, Column } from '@island.is/island-ui/core'

interface PropTypes {
  children: ReactNode
}

function FormLayout({ children }: PropTypes) {
  return (
    <Box paddingX="gutter">
      <ContentBlock>
        <Columns space="gutter" collapseBelow="lg">
          <Column width="2/3">
            <Box background="blue100" paddingX={[5, 12]} paddingY={[5, 9]}>
              {children}
            </Box>
          </Column>
        </Columns>
      </ContentBlock>
    </Box>
  )
}

export default FormLayout
