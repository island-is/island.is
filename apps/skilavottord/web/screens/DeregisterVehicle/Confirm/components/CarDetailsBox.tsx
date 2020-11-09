import React, { FC } from 'react'
import { Box, Text, Stack } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import { Vehicle } from '@island.is/skilavottord-web/types'
import { getYear } from '@island.is/skilavottord-web/utils'

interface BoxProps {
  vehicle: Vehicle
}

export const CarDetailsBox: FC<BoxProps> = ({
  vehicle: { vehicleId, vehicleType, newregDate, recyclingRequests },
}: BoxProps) => {
  const modelYear = getYear(newregDate)
  const vehicleOwner = recyclingRequests && recyclingRequests[0].nameOfRequestor

  return (
    <OutlinedBox>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        paddingX={4}
        paddingY={4}
      >
        <Stack space={1}>
          <Text variant="h3">{vehicleId}</Text>
          <Text>{`${vehicleType}, ${modelYear}`}</Text>
        </Stack>
        <Text variant="h5">{vehicleOwner}</Text>
      </Box>
    </OutlinedBox>
  )
}
