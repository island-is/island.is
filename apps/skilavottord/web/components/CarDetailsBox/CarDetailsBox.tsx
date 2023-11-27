import React, { FC } from 'react'
import { Box, Text, Stack } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'

interface BoxProps {
  vehicleId: string
  vehicleType: string
  modelYear: string
  vehicleOwner?: string | null
}

export const CarDetailsBox: FC<React.PropsWithChildren<BoxProps>> = ({
  vehicleId,
  vehicleType,
  modelYear,
  vehicleOwner,
}) => {
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
