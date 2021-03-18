import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, GridRow } from '@island.is/island-ui/core'

const UserSignature: FC<FieldBaseProps> = () => {
  return (
    <Box marginTop={4}>
      <GridRow></GridRow>
      <Box marginTop={5} marginBottom={3}>
        <Text variant="h5">This is some text that</Text>
      </Box>
    </Box>
  )
}

export default UserSignature
