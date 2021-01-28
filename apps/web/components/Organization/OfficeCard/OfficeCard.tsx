import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'

interface OfficeCardProps {
  name: string
  address: string
  city: string
  openingHours: string
}

export const OfficeCard: React.FC<OfficeCardProps> = ({
  name,
  address,
  city,
  openingHours,
}) => {
  return (
    <Box
      borderRadius="large"
      overflow="hidden"
      background="blue100"
      boxShadow="subtle"
      border="standard"
      borderColor="blue200"
      marginBottom={[1, 1, 1]}
      marginTop={[1, 1, 1]}
      paddingX={[3, 3, 3]}
      paddingY={[3, 3, 3]}
    >
      <Text variant="h4" as="h1">
        {name}
      </Text>
      <Text marginTop={1}>{address}</Text>
      <Text marginTop={2} fontWeight="semiBold">
        Opnunartími
      </Text>
      {openingHours.split('\n').map((line) => (
        <Text marginTop={1}>{line}</Text>
      ))}
    </Box>
  )
}
