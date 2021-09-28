import React, { FC, useMemo } from 'react'

import {
  FieldBaseProps,
  DateField,
  formatText,
  MaybeWithApplicationAndField,
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

export const DateFormField: FC<Props> = ({ application, error, field }) => {
  const {
    id,
    disabled,
    title,
    description,
    defaultValue,
    placeholder,
    backgroundColor,
    excludeDates,
    minDate,
    onChange,
  } = field
  const { formatMessage, lang } = useLocale()

  const computedDefaultValue =
    typeof defaultValue === 'function'
      ? defaultValue(application, field)
      : defaultValue

  const computeMinDate = (
    maybeMinDate: MaybeWithApplicationAndField<Date>,
    memoApplication: Application,
    memoField: DateField,
  ) => {
    if (typeof maybeMinDate === 'function') {
      return maybeMinDate(memoApplication, memoField)
    }

    return maybeMinDate
  }

  const computeExcludeDates = (
    maybeExcludeDates: MaybeWithApplicationAndField<Date[]>,
    memoApplication: Application,
    memoField: DateField,
  ) => {
    if (typeof maybeExcludeDates === 'function') {
      return maybeExcludeDates(memoApplication, memoField)
    }

    return maybeExcludeDates
  }

  const finalMinDate = useMemo(
    () =>
      computeMinDate(
        minDate as MaybeWithApplicationAndField<Date>,
        application,
        field,
      ),
    [minDate, application, field],
  )

  const finalExcludeDates = useMemo(
    () =>
      computeExcludeDates(
        excludeDates as MaybeWithApplicationAndField<Date[]>,
        application,
        field,
      ),
    [excludeDates, application, field],
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
          defaultValue={computedDefaultValue}
          id={id}
          name={id}
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
          onChange={onChange}
        />
      </Box>
    </div>
  )
}
