import React, { FC } from 'react'
import { DividerField } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'

const DividerFormField: FC<{
  field: DividerField
}> = ({ field }) => {
  return (
    <Box marginTop={5} marginBottom={1}>
      <Text variant="h3" color={field.color ?? 'blue400'}>
        {field.name}
      </Text>
    </Box>
  )
}

export default DividerFormField
