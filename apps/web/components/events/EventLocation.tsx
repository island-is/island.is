import { Box, Text } from '@island.is/island-ui/core'
import { EventLocation as EventLocationSchema } from '@island.is/web/graphql/schema'

interface EventLocationProps {
  location?: EventLocationSchema
}

export const EventLocation = ({ location }: EventLocationProps) => {
  if (!location?.useFreeText) {
    return (
      <Box>
        <Text>
          {location?.streetAddress}
          {location?.streetAddress &&
            (location?.floor || location?.postalCode) &&
            ', '}
          {location?.floor ? location.floor : ''}
          {location?.postalCode && location?.floor ? ', ' : ''}
        </Text>
        <Text>{location?.postalCode}</Text>
      </Box>
    )
  }

  return (
    <Box style={{ maxWidth: '100%' }}>
      <Text>{location?.freeText}</Text>
    </Box>
  )
}
