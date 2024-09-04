import {
  AlertMessage,
  Box,
  ContentBlock,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { OutlinedBox } from '@island.is/skilavottord-web/components'
import React, { FC, useState } from 'react'

import { useI18n } from '@island.is/skilavottord-web/i18n'

import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'

import { Control, FieldValues } from 'react-hook-form'
import { PlateInfo } from '@island.is/skilavottord-web/utils/consts'

interface BoxProps {
  vehicleId: string
  vehicleType: string
  modelYear: string
  vehicleOwner?: string | null
  mileage?: number
  control?: Control<FieldValues>
  showMileage?: boolean
  isDeregistered?: boolean
}

export const CarDetailsBox: FC<React.PropsWithChildren<BoxProps>> = ({
  vehicleId,
  vehicleType,
  modelYear,
  vehicleOwner,
  mileage,
  showMileage,
  isDeregistered,
}) => {
  const {
    t: {
      deregisterVehicle: { deregister: t },
    },
  } = useI18n()

  //isDeregistered = true

  const [missingPlates, setMissingPlates] = useState(false)

  return (
    <OutlinedBox>
      {isDeregistered && (
        <Box>
          <ContentBlock>
            <AlertMessage
              type="error"
              title={'Ökutækið er þegar skráð úr umferð hjá Samgöngustofu'}
              message={'Engin skráningarmerki eiga að vera á þessu ökutæki'}
            />
          </ContentBlock>
        </Box>
      )}
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
              label={t.currentMileage}
              name="mileage"
              type="number"
              defaultValue={mileage?.toString()}
            />
          </Box>
        )}
      </Box>
      {isDeregistered && (
        <Box>
          <SelectController
            label="Fjöldi skráningarmerkja skilað með ökutækinu"
            id="plateCount"
            name="plateCount"
            options={[
              { label: '0', value: 0 },
              { label: '1', value: 1 },
              { label: '2', value: 2 },
            ]}
            onSelect={(option) => {
              setMissingPlates(option?.value !== 2 ? true : false)
            }}
          />

          <CheckboxController
            split="1/2"
            id="plateInfo"
            name="plateInfo"
            backgroundColor="blue"
            defaultValue={[]}
            options={[
              {
                label: 'Skráningarmerkin eru týnd',
                value: PlateInfo.PLATE_LOST,
              },
            ]}
            disabled={!missingPlates}
          />
        </Box>
      )}
    </OutlinedBox>
  )
}
