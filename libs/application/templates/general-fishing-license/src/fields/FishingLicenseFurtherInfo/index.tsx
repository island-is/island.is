import React, { FC } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DatePickerController, InputController } from '@island.is/shared/form-fields'
import { fishingLicense, fishingLicenseFurtherInformation } from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import { FishingLicenseShip as Ship } from '@island.is/api/schema'
import { ShipInformation } from '../components'
 
export const FishingLicenseFurtherInfo: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  console.log(errors)
  const { formatMessage, lang} = useLocale()
  const selectedChargeType = getValueViaPath(
    application.answers,
    'fishingLicense.license',
    ''
  ) as FishingLicenseEnum
  const licenseName = formatMessage(fishingLicense.labels[selectedChargeType]) || ''
  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]
  const registrationNumber = getValueViaPath(
    application.answers,
    'shipSelection.registrationNumber',
  ) as string
  const ship = ships.find(s => s.registrationNumber.toString() === registrationNumber)
 return (
    <>
      <Box marginBottom={2}>
        {licenseName && (
          <Text marginBottom={2}>
            {formatMessage(fishingLicenseFurtherInformation.general.applicationPrefix)} {licenseName || 'veiðileyfi'} {formatMessage(fishingLicenseFurtherInformation.general.applicationPostfix)}
          </Text>
        )}
        {ship && (
          <Box marginBottom={2}>
            <Box
              border="standard"
              borderRadius="large"
              padding={3}
              width="full"
              display="flex"
              justifyContent="spaceBetween"
            >
              <ShipInformation ship={ship} seaworthinessHasColor />
            </Box>
          </Box>
        )}
        <Box>
          <DatePickerController
            id={`${field.id}.date`}
            error={errors && getErrorViaPath(errors, `${field.id}.date`)}
            backgroundColor="blue"
            locale={lang}
            label={formatMessage(fishingLicenseFurtherInformation.labels.date)}
            placeholder={formatMessage(fishingLicenseFurtherInformation.placeholders.date)}
            minDate={new Date()}
          />
        </Box>
      </Box>
    </>
  )
}
