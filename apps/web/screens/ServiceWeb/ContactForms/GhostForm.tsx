import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'

const GhostForm = () => {
  return (
    <>
      <GridRow>
        <GridColumn span="12/12">
          <Box
            marginTop={5}
            background="blue100"
            padding={5}
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="12/12">
          <Box
            marginTop={5}
            background="blue100"
            padding={5}
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="6/12">
          <Box
            marginTop={5}
            background="blue100"
            padding={5}
            borderRadius="large"
          ></Box>
        </GridColumn>
        <GridColumn span="6/12">
          <Box
            marginTop={5}
            background="blue100"
            padding={5}
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span="12/12">
          <Box
            marginTop={5}
            background="blue100"
            padding={20}
            borderRadius="large"
          ></Box>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default GhostForm
