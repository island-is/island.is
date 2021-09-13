import React from 'react'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'

const GhostForm = () => {
  return (
    <>
      <GridRow>
        <GridColumn span="12/12">
          <Box
            padding={5}
            marginBottom={3}
            background="blue100"
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="12/12">
          <Box
            padding={5}
            marginBottom={[3, 8]}
            background="blue100"
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['12/12', '6/12']}>
          <Box
            padding={5}
            marginBottom={3}
            background="blue100"
            borderRadius="large"
          ></Box>
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <Box
            padding={5}
            marginBottom={[3, 8]}
            background="blue100"
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="12/12">
          <Box
            paddingY={[15, 20]}
            background="blue100"
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default GhostForm
