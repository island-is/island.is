import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'

export const EmployerInfo = (props: FieldBaseProps) => {
  // TODO: Get employer info
  const employerInfo = {
    employerSsn: '450199-3389',
    employerName: 'Bónus ehf.',
  }

  return (
    <Box marginTop={5} marginBottom={3}>
      <Text variant="h2">{employerInfo.employerName}</Text>
      <Text variant="eyebrow" color="blue400">
        {employerInfo.employerSsn}
      </Text>
    </Box>
  )
}
