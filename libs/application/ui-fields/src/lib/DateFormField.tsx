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
  } = field
  const { formatMessage, lang } = useLocale()

  const computeExcludeDates = (
    maybeExcludeDates: MaybeWithApplication<Date[]>,
    application: Application,
  ) => {
    if (typeof maybeExcludeDates === 'function') {
      return maybeExcludeDates(application)
    }
    return maybeExcludeDates
  }

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
