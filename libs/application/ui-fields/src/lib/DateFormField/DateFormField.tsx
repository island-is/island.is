import React, { FC, useMemo } from 'react'

import {
  buildFieldRequired,
  formatText,
  formatTextWithLocale,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  DateField,
  MaybeWithApplicationAndField,
  Application,
  FormValue,
  BaseField,
} from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  DatePickerController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getDefaultValue } from '../../getDefaultValue'
import { Locale } from '@island.is/shared/types'
import { useWatch } from 'react-hook-form'

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
    title = '',
    description,
    required,
    placeholder,
    backgroundColor,
    excludeDates,
    minDate,
    maxDate,
    minYear,
    maxYear,
    onChange,
    readOnly,
    marginTop,
    marginBottom,
    clearOnChange,
    tempDisabled,
  } = field
  const { formatMessage, lang } = useLocale()
  const allValues = useWatch({ defaultValue: application.answers }) as FormValue
  const updatedApplication = useMemo(
    () => ({ ...application, answers: allValues }),
    [application, allValues],
  )

  const isDisabled = useMemo(() => {
    if (tempDisabled) {
      return tempDisabled(updatedApplication)
    }
    return disabled
  }, [disabled, tempDisabled, updatedApplication])

  const computeMinDate = (
    maybeMinDate: MaybeWithApplicationAndField<Date | undefined>,
    memoApplication: Application,
    memoField: DateField,
  ) => {
    if (typeof maybeMinDate === 'function') {
      return maybeMinDate(memoApplication, memoField)
    }

    return maybeMinDate
  }

  const computeMaxDate = (
    maybeMaxDate: MaybeWithApplicationAndField<Date | undefined>,
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
        minDate as MaybeWithApplicationAndField<Date | undefined>,
        updatedApplication,
        field,
      ),
    [minDate, updatedApplication, field],
  )

  const finalMaxDate = useMemo(
    () =>
      computeMaxDate(
        maxDate as MaybeWithApplicationAndField<Date | undefined>,
        updatedApplication,
        field,
      ),
    [maxDate, updatedApplication, field],
  )

  const finalExcludeDates = useMemo(
    () =>
      computeExcludeDates(
        excludeDates as MaybeWithApplicationAndField<Date[]>,
        updatedApplication,
        field,
      ),
    [excludeDates, updatedApplication, field],
  )

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {description && (
        <FieldDescription
          description={formatTextWithLocale(
            description,
            application,
            lang as Locale,
            formatMessage,
          )}
        />
      )}

      <Box paddingTop={2}>
        <DatePickerController
          disabled={isDisabled}
          defaultValue={
            (getValueViaPath(application.answers, id) as string) ??
            getDefaultValue(field as BaseField, application)
          }
          id={id}
          name={id}
          locale={lang}
          required={buildFieldRequired(application, required)}
          excludeDates={finalExcludeDates}
          minDate={finalMinDate}
          maxDate={finalMaxDate}
          minYear={minYear}
          maxYear={maxYear}
          backgroundColor={backgroundColor}
          readOnly={readOnly}
          label={formatTextWithLocale(title, application, lang, formatMessage)}
          placeholder={
            placeholder
              ? formatText(placeholder, application, formatMessage)
              : undefined
          }
          error={error}
          onChange={onChange}
          clearOnChange={clearOnChange}
        />
      </Box>
    </Box>
  )
}
