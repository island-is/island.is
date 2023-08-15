import React, { FC } from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { DatePickerController } from '@island.is/shared/form-fields'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { DATE_FIELD_ID, DATE_CONSTRAINTS_FIELD_ID } from '../../utils/fields'

type DateConstraint = { dateFrom?: string | null; dateTo?: string | null }
export const DateWithContraintsSelection: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application, errors }) => {
  const { formatMessage, lang } = useLocale()

  const dateConstraints = getValueViaPath(
    application.answers,
    DATE_CONSTRAINTS_FIELD_ID,
    { dateFrom: null, dateTo: null },
  ) as DateConstraint

  // Constructs the lower limit for date picker
  // Depending on which select option is currently selected
  const getMinDate = () => {
    const minDate = dateConstraints?.dateFrom || null
    if (minDate) {
      return new Date(minDate)
    }
    return new Date()
  }

  // Constructs the upper limit for date picker
  // Depending on which select option is currently selected
  const getMaxDate = () => {
    const maxDate = dateConstraints?.dateTo || null
    if (maxDate) {
      return new Date(maxDate)
    }
    return null
  }

  return (
    <Box>
      <Box marginTop={3}>
        <DatePickerController
          id={DATE_FIELD_ID}
          name={DATE_FIELD_ID}
          required
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
