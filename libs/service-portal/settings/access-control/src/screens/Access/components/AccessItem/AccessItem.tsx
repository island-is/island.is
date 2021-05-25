import React from 'react'

import { Box, Stack, GridRow, GridColumn } from '@island.is/island-ui/core'

interface PropTypes {
  size?: 'sm'
  background?: 'blue'
  children: [React.ReactNode, React.ReactNode, React.ReactNode]
}

function AccessItem({ size, background, children }: PropTypes) {
  return (
    <Box
      background={background === 'blue' ? 'blue100' : undefined}
      paddingX={size === 'sm' ? 7 : 2}
      paddingY={size === 'sm' ? 1 : 2}
      border={background === 'blue' ? undefined : 'standard'}
      borderRadius="large"
    >
      <GridRow direction="row" align="flexEnd">
        <GridColumn span="2/6">{children[0]}</GridColumn>
        <GridColumn span="3/6">{children[1]}</GridColumn>
        <GridColumn span="1/6">{children[2]}</GridColumn>
      </GridRow>
    </Box>
  )
}

export default AccessItem
