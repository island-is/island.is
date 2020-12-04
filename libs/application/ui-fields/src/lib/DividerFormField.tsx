import React, { FC } from 'react'
import { DividerField } from '@island.is/application/core'
import { Box, Text, Divider } from '@island.is/island-ui/core'

const DividerFormField: FC<{
  field: DividerField
}> = ({ field }) => {
  if (field.name) {
    return (
      <Box marginTop={5} marginBottom={1}>
        <Text variant="h3" color={field.color ?? 'blue400'}>
          {field.name}
        </Text>
      </Box>
    )
  }

  return (
    <Box paddingTop={2} paddingBottom={2}>
      <Divider />
    </Box>
  )
}

export default DividerFormField
