import React, { FC } from 'react'
import { DividerField } from '@island.is/application/template'
import { Box, Typography } from '@island.is/island-ui/core'

const DividerFormField: FC<{
  field: DividerField
}> = ({ field }) => {
  return (
    <Box marginTop={5} marginBottom={1}>
      <Typography variant="h3" color="blue400">
        {field.name}
      </Typography>
    </Box>
  )
}

export default DividerFormField
