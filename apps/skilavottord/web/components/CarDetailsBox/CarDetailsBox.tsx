import { Box, Stack, Text } from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import React, { FC } from 'react'

import { useI18n } from '@island.is/skilavottord-web/i18n'

import { InputController } from '@island.is/shared/form-fields'
import { Control, FieldValues } from 'react-hook-form'

interface BoxProps {
  vehicleId: string
  vehicleType: string
  modelYear: string
  vehicleOwner?: string | null
  mileage?: number
  control?: Control<FieldValues>
  showMileage?: boolean
}

export const CarDetailsBox: FC<React.PropsWithChildren<BoxProps>> = ({
  vehicleId,
  vehicleType,
  modelYear,
  vehicleOwner,
  mileage,
  control,
  showMileage,
}) => {
  const {
    t: {
      deregisterVehicle: { deregister: t },
    },
  } = useI18n()

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
          {showMileage && <Text variant="h5">{mileage} km</Text>}
          <Text>{`${vehicleType}, ${modelYear}`}</Text>
        </Stack>
        <Text variant="h5">{vehicleOwner}</Text>

        {showMileage && (
          <Box>
            <InputController
              id="mileage"
              control={control}
              label={t.currentMileage}
              name="mileage"
              type="number"
              defaultValue={mileage?.toString()}
            />
          </Box>
        )}
      </Box>
    </OutlinedBox>
  )
}
