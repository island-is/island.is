import React, { FC } from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'

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
        <Text variant="h5">Tvö hjúskaparstöðuvottorð</Text>
        <Text variant="h5">5.500 kr.</Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">Tvö fæðingarvottorð</Text>
        <Text variant="h5">5.500 kr.</Text>
      </Box>
      <Box display="flex" marginBottom={3} justifyContent="spaceBetween">
        <Text variant="h5">Könnunarvottorð</Text>
        <Text variant="h5">4.500 kr.</Text>
      </Box>
      <Divider />
      <Box display="flex" paddingTop={3} justifyContent="spaceBetween">
        <Text variant="h3" color="blue400">
          Samtals
        </Text>
        <Text variant="h3" color="blue400">
          15.500 kr.
        </Text>
      </Box>
    </Box>
  )
}
