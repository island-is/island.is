import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Stack, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useState } from 'react'
import { ShipInformation } from '../components'
import { RadioController } from '@island.is/shared/form-fields'
import { shipSelection } from '../../lib/messages'
import { FishingLicenseShip as Ship } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import { FishingLicenseEnum } from '../../types'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export const ShipSelection: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { register, setValue } = useFormContext()

  const registrationNumberValue = getValueViaPath(
    application.answers,
    'shipSelection.registrationNumber',
  ) as string

  const [registrationNumber, setRegistrationNumber] = useState<string>(
    registrationNumberValue || '',
  )

  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]

  const shipOptions = (ships: Ship[]) => {
    const options = [] as Option[]
    for (const [index, ship] of ships.entries()) {
      options.push({
        value: `${index}`,
        label: (
          <>
            <Box width="full" display="flex" justifyContent="spaceBetween">
              <ShipInformation ship={ship} seaworthinessHasColor />
              <Stack space={1} align="right">
                {ship.fishingLicenses?.map((license) => {
                  if (license.code === 'unknown') return null
                  return (
                    <Tag variant="blue" disabled key={`${license}`}>
                      {formatMessage(shipSelection.tags[license.code])}
                    </Tag>
                  )
                })}
              </Stack>
            </Box>
          </>
        ),
      })
    }
    return options
  }

  return (
    <Box marginBottom={2}>
      <RadioController
        id={`${field.id}.ship`}
        largeButtons
        backgroundColor="white"
        error={errors && getErrorViaPath(errors, `${field.id}.ship`)}
        defaultValue={
          (getValueViaPath(application.answers, 'shipSelection') as string[]) ??
          undefined
        }
        onSelect={(value) => {
          const ship = ships[parseInt(value)]
          setRegistrationNumber(ship.registrationNumber.toString())
          // Set fishing license to null/unknown since we've now changed ships
          // and the chosen license could be invalid for the new ship selection
          // null/unknown signals error in front end on next screen
          setValue('fishingLicense.license', FishingLicenseEnum.UNKNOWN)
          setValue('fishingLicense.chargeType', FishingLicenseEnum.UNKNOWN)
        }}
        options={shipOptions(ships)}
      />
      <input
        type="hidden"
        value={registrationNumber}
        ref={register({ required: true })}
        name={`${field.id}.registrationNumber`}
      />
    </Box>
  )
}
