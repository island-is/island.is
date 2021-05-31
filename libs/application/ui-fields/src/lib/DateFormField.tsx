import React, { FC, useMemo } from 'react'
import {
  FieldBaseProps,
  DateField,
  formatText,
  MaybeWithApplication,
  Application,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: DateField
}

const DateFormField: FC<Props> = ({ application, error, field }) => {
  const {
    id,
    disabled,
    title,
    description,
    placeholder,
    backgroundColor,
    excludeDates,
    minDate,
  } = field
  const { formatMessage, lang } = useLocale()

  const computeMinDate = (
    maybeMinDate: MaybeWithApplication<Date>,
    application: Application,
  ) => {
    if (typeof maybeMinDate === 'function') {
      return maybeMinDate(application)
    }

    return maybeMinDate
  }

  const computeExcludeDates = (
    maybeExcludeDates: MaybeWithApplication<Date[]>,
    application: Application,
  ) => {
    if (typeof maybeExcludeDates === 'function') {
      return maybeExcludeDates(application)
    }

    return maybeExcludeDates
  }

  const finalMinDate = useMemo(
    () => computeMinDate(minDate as MaybeWithApplication<Date>, application),
    [minDate, application],
  )

  const finalExcludeDates = useMemo(
    () =>
      computeExcludeDates(
        excludeDates as MaybeWithApplication<Date[]>,
        application,
      ),
    [excludeDates, application],
  )

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <DatePickerController
          disabled={disabled}
          id={id}
          name={`${id}`}
          locale={lang}
          excludeDates={finalExcludeDates}
          minDate={finalMinDate}
          backgroundColor={backgroundColor}
          label={formatText(title, application, formatMessage)}
          placeholder={
            placeholder
              ? formatText(placeholder, application, formatMessage)
              : undefined
          }
          error={error}
        />
      </Box>
    </div>
  )
}

export default DateFormField
