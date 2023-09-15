import React, { FC, useMemo } from 'react'

import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  DateField,
  MaybeWithApplicationAndField,
  Application,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getDefaultValue } from '../../getDefaultValue'

interface Props extends FieldBaseProps {
  field: DateField
}

export const DateFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  error,
  field,
}) => {
  const {
    id,
    disabled,
    title,
    description,
    defaultValue,
    required,
    placeholder,
    backgroundColor,
    excludeDates,
    minDate,
    maxDate,
    onChange,
  } = field
  const { formatMessage, lang } = useLocale()

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

  const computeMaxDate = (
    maybeMaxDate: MaybeWithApplicationAndField<Date>,
    memoApplication: Application,
    memoField: DateField,
  ) => {
    if (typeof maybeMaxDate === 'function') {
      return maybeMaxDate(memoApplication, memoField)
    }

    return maybeMaxDate
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

  const finalMaxDate = useMemo(
    () =>
      computeMaxDate(
        maxDate as MaybeWithApplicationAndField<Date>,
        application,
        field,
      ),
    [maxDate, application, field],
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
          defaultValue={
            (getValueViaPath(application.answers, id) as string) ??
            getDefaultValue(field, application)
          }
          id={id}
          name={id}
          locale={lang}
          required={required}
          excludeDates={finalExcludeDates}
          minDate={finalMinDate}
          maxDate={finalMaxDate}
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
