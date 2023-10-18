import { Box, Text } from '@island.is/island-ui/core'

interface EventLocationProps {
  streetAddress?: string
  postalCode?: string
  floor?: string
}

export const EventLocation = ({
  streetAddress,
  postalCode,
  floor,
}: EventLocationProps) => {
  return (
    <Box>
      <Text>
        {streetAddress}
        {streetAddress && (floor || postalCode) && ', '}
        {floor ? floor + ', ' : ''}
      </Text>
      <Text>{postalCode}</Text>
    </Box>
  )
}
