import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'
import * as Sentry from '@sentry/react'

import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
  getValueViaPath,
  MaybeWithApplicationAndField,
} from '@island.is/application/core'
import { DateFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'

import {
  getAvailableRightsInDays,
  getExpectedDateOfBirth,
  getPeriodIndex,
} from '../../lib/parentalLeaveUtils'
import { minimumRatio } from '../../config'
import { useGetOrRequestLength } from '../../hooks/useGetOrRequestLength'
import { daysToMonths } from '../../lib/directorateOfLabour.utils'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'
import { useDaysAlreadyUsed } from '../../hooks/useDaysAlreadyUsed'

type FieldPeriodEndDateProps = {
  field: {
    props: {
      minDate?: MaybeWithApplicationAndField<Date>
      excludeDates?: MaybeWithApplicationAndField<Date[]>
    }
  }
}

export const PeriodEndDate: FC<
  FieldBaseProps & CustomField & FieldPeriodEndDateProps
> = ({ field, application, errors, setFieldLoadingState }) => {
  const { formatMessage } = useLocale()
  const { id, title, props } = field
  const { answers } = application
  const { getLength, loading } = useGetOrRequestLength(application)
  const { register, clearErrors, setError } = useFormContext()
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentIndex = getPeriodIndex(field)
  const currentStartDateAnswer = getValueViaPath(
    answers,
    `periods[${currentIndex}].startDate`,
    expectedDateOfBirth,
  ) as string
  const [percent, setPercent] = useState<number>(100)
  const [duration, setDuration] = useState<number>(0)
  const [days, setDays] = useState<number>(0)
  const error =
    (errors as FieldErrors<FieldValues>)?.periods?.[currentIndex]?.endDate
      ?.message ?? (errors?.[`periods[${currentIndex}].endDate`] as string)
  const fieldId = `periods[${currentIndex}].endDate`

  const handleChange = async (date: string) => {
    try {
      clearErrors(id)

      const endDate = new Date(date).toISOString()

      const { length, percentage } = await getLength({
        startDate: currentStartDateAnswer,
        endDate,
      })

      if (percentage < minimumRatio) {
        return setError(fieldId, {
          type: 'error',
          message: formatMessage(errorMessages.periodsRatioBelowMinimum),
        })
      }

      setPercent(percentage)
      setDays(length)
      setDuration(daysToMonths(length))
    } catch (e) {
      Sentry.captureException((e as Error).message)

      setError(fieldId, {
        type: 'error',
        message: formatMessage(errorMessages.durationPeriods),
      })
    }
  }

  useEffect(() => {
    if (currentIndex < 0) {
      Sentry.captureException(
        new Error(
          'Cannot render PeriodEndDate component with a currentIndex of -1',
        ),
      )
    }
  }, [currentIndex])

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [setFieldLoadingState, loading])

  if (currentIndex < 0) {
    return null
  }

  return (
    <>
      <Box>
        <FieldDescription
          description={formatMessage(
            parentalLeaveFormMessages.endDate.description,
          )}
        />
      </Box>
      <DateFormField
        application={application}
        error={error}
        field={{
          type: FieldTypes.DATE,
          component: FieldComponents.DATE,
          title,
          id: fieldId,
          minDate: props.minDate,
          excludeDates: props.excludeDates,
          children: undefined,
          placeholder: parentalLeaveFormMessages.endDate.placeholder,
          onChange: handleChange,
          backgroundColor: 'blue',
          defaultValue: null,
        }}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={duration}
        name={`periods[${currentIndex}].duration`}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={days}
        name={`periods[${currentIndex}].days`}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={percent}
        name={`periods[${currentIndex}].percentage`}
      />
    </>
  )
}
