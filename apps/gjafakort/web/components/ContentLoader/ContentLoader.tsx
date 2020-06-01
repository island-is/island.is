import React from 'react'

import { Box, ContentBlock, Column, Columns } from '@island.is/island-ui/core'

import { Loader } from '..'

interface PropTypes {
  width?: '1/2' | '2/3'
}

function ContentLoader({ width = '2/3' }: PropTypes) {
  return (
    <ContentBlock width="large">
      <Columns space="gutter" collapseBelow="lg">
        <Column width={width}>
          <Box
            background="blue100"
            paddingX={[5, 12]}
            paddingY={[5, 9]}
            marginTop={12}
            textAlign="center"
          >
            <Loader />
          </Box>
        </Column>
      </Columns>
    </ContentBlock>
  )
}

export default ContentLoader
