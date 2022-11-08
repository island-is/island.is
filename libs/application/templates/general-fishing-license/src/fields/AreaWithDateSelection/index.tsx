import React, { FC, useState } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Option } from '@island.is/island-ui/core'
import {
  DatePickerController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { AREA_FIELD_ID, DATE_FIELD_ID } from '../../utils/fields'

const MOCKSELECTOPTIONS = [
  {
    key: 'A',
    dateRestriction: {
      dateFrom: '2022-10-20T00:00:00.000Z',
      dateTo: '2022-11-30T00:00:00.000Z',
    },
    description: 'Veiðisvæði A 20.10 - 30.11',
    disabled: false,
    invalidOption: false,
  },
  {
    key: 'B',
    dateRestriction: {
      dateFrom: '2022-11-20T00:00:00.000Z',
      dateTo: '2022-12-30T00:00:00.000Z',
    },
    description: 'Veiðisvæði B 20.11 - 30.12',
    disabled: false,
    invalidOption: false,
  },
]

export const AreaWithDateSelection: FC<FieldBaseProps> = ({
  application,
  errors,
}) => {
  const { setValue } = useFormContext()
  const { formatMessage, lang } = useLocale()
  const initialArea = getValueViaPath(
    application.answers,
    `fishingLicenseFurtherInformation.area`,
    '',
  ) as string
  const [selectedArea, setSelectedArea] = useState<string | number>(
    initialArea || '',
  )

  // Constructs the lower limit for date picker
  // Depending on which select option is currently selected
  const getMinDate = () => {
    const minDate = MOCKSELECTOPTIONS.find((o) => o.key === selectedArea)
      ?.dateRestriction.dateFrom
    if (minDate) {
      return new Date(minDate)
    }
    return new Date()
  }

  // Constructs the upper limit for date picker
  // Depending on which select option is currently selected
  const getMaxDate = () => {
    const maxDate = MOCKSELECTOPTIONS.find((o) => o.key === selectedArea)
      ?.dateRestriction.dateTo
    if (maxDate) {
      return new Date(maxDate)
    }
    return null
  }

  // Resets datepicker when new area is selected due to
  // it's date restrictions
  const handleAreaSelect = (o: Option) => {
    setSelectedArea(o.value)
    setValue(DATE_FIELD_ID, null)
  }

  return (
    <Box>
      <Box marginTop={3}>
        <SelectController
          id={AREA_FIELD_ID}
          name={AREA_FIELD_ID}
          backgroundColor="blue"
          label={formatMessage(fishingLicenseFurtherInformation.labels.area)}
          placeholder={formatMessage(
            fishingLicenseFurtherInformation.placeholders.area,
          )}
          onSelect={handleAreaSelect}
          required
          error={errors && getErrorViaPath(errors, AREA_FIELD_ID)}
          defaultValue={''}
          options={MOCKSELECTOPTIONS.map((o) => ({
            label: o.description,
            value: o.key,
          }))}
        />
      </Box>
      <Box marginTop={3}>
        <DatePickerController
          id={DATE_FIELD_ID}
          name={DATE_FIELD_ID}
          disabled={!selectedArea}
          backgroundColor="blue"
          locale={lang}
          label={formatMessage(fishingLicenseFurtherInformation.labels.date)}
          placeholder={formatMessage(
            fishingLicenseFurtherInformation.placeholders.date,
          )}
          error={
            errors &&
            getErrorViaPath(errors, `fishingLicenseFurtherInformation.date`)
          }
          minDate={getMinDate()}
          maxDate={getMaxDate()}
        />
      </Box>
    </Box>
  )
}
