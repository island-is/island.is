import React, { FC, useEffect, useState } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, StringOption as Option } from '@island.is/island-ui/core'
import {
  DatePickerController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import {
  AREAS_FIELD_ID,
  AREA_FIELD_ID,
  DATE_FIELD_ID,
} from '../../utils/fields'
import { FishingLicenseListOptions } from '../../types/schema'

export const AreaWithDateSelection: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, errors }) => {
  const { setValue } = useFormContext()
  const { formatMessage, lang } = useLocale()

  const [selectedArea, setSelectedArea] = useState<string | number>('')
  const [licenseAreas, setLicenseAreas] = useState<FishingLicenseListOptions[]>(
    [],
  )

  // Constructs the lower limit for date picker
  // Depending on which select option is currently selected
  const getMinDate = () => {
    const minDate =
      licenseAreas?.find((o) => o.key === selectedArea)?.dateRestriction
        ?.dateFrom || null
    if (minDate) {
      return new Date(minDate)
    }
    return new Date()
  }

  // Constructs the upper limit for date picker
  // Depending on which select option is currently selected
  const getMaxDate = () => {
    const maxDate =
      licenseAreas?.find((o) => o.key === selectedArea)?.dateRestriction
        ?.dateTo || null
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

  // Initialize areas selection dropdown based on selected license
  useEffect(() => {
    const areas = getValueViaPath(
      application.answers,
      AREAS_FIELD_ID,
      [],
    ) as FishingLicenseListOptions[]
    setLicenseAreas(areas)
    const initialArea = getValueViaPath(
      application.answers,
      `fishingLicenseFurtherInformation.area`,
      '',
    ) as string
    // If only one option is available, preselect that option
    if (areas && areas.length === 1 && areas[0].key) {
      setSelectedArea(areas[0].key)
      setValue(AREA_FIELD_ID, areas[0].key)
    } else if (areas?.find((a) => a.key === initialArea)) {
      setSelectedArea(initialArea)
    } else {
      setValue(AREA_FIELD_ID, '')
    }
  }, [])

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
          options={licenseAreas?.map((o) => ({
            label: o.description || '',
            value: o.key || '',
          }))}
        />
      </Box>
      <Box marginTop={3}>
        <DatePickerController
          id={DATE_FIELD_ID}
          name={DATE_FIELD_ID}
          required
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
