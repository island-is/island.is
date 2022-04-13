import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/core'

export type Individual = {
  name: string
  nationalId: string
  phone: string
  email: string
}

export const PaymentInfo: FC<FieldBaseProps> = () => {
  return (
    <Box>
      <Text variant="h2" marginBottom={3}>
        {'Greiðsla'}
      </Text>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">Veðbókarvottorð</Text>
        <Text variant="h5">2.000kr</Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">Veðbókarvottorð</Text>
        <Text variant="h5">2.000kr</Text>
      </Box>
      <Divider />
      <Box display="flex" paddingTop={3} justifyContent="spaceBetween">
        <Text variant="h3" color="blue400">
          Samtals
        </Text>
        <Text variant="h3" color="blue400">
          2.000kr
        </Text>
      </Box>
    </Box>
  )
}
