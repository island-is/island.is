import React, { FC, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'

import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  getValueViaPath,
  MaybeWithApplicationAndField,
} from '@island.is/application/core'
import { DateFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'

import {
  getAvailablePersonalRightsInDays,
  getExpectedDateOfBirth,
  getPeriodIndex,
} from '../../lib/parentalLeaveUtils'
import { useGetOrRequestLength } from '../../hooks/useGetOrRequestLength'
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'
import { daysToMonths } from '../../lib/directorateOfLabour.utils'
import { errorMessages, parentalLeaveFormMessages } from '../../lib/messages'

type FieldPeriodEndDateProps = {
  field: {
    props: {
      minDate?: MaybeWithApplicationAndField<Date>
      excludeDates?: MaybeWithApplicationAndField<Date[]>
    }
  }
}

export const PeriodEndDate: FC<FieldBaseProps & FieldPeriodEndDateProps> = ({
  field,
  application,
  errors,
  setFieldLoadingState,
}) => {
  const { formatMessage } = useLocale()
  const { id, title, props } = field
  const rights = getAvailablePersonalRightsInDays(application)
  const { periods } = useApplicationAnswers(application)
  const daysAlreadyUsed = useMemo(
    () =>
      periods.reduce(
        (acc, period) => acc + (period?.days ? Number(period.days) : 0),
        0,
      ),
    [periods],
  )
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
  const [percent, setPercent] = useState<number | undefined>(undefined)
  const [duration, setDuration] = useState<number>(0)
  const [days, setDays] = useState<number>(0)
  const error =
    (errors as FieldErrors<FieldValues>)?.periods?.[currentIndex]?.endDate
      ?.message ?? (errors?.[`periods[${currentIndex}].endDate`] as string)
  const fieldId = `periods[${currentIndex}].endDate`

  const handleChange = async (date: string) => {
    clearErrors(id)

    const endDate = new Date(date).toISOString()

    const { length, percentage } = await getLength({
      startDate: currentStartDateAnswer,
      endDate,
    })

    if (length + daysAlreadyUsed > rights) {
      return setError(fieldId, {
        type: 'error',
        message: formatMessage(errorMessages.exceedingLength, {
          days: length + daysAlreadyUsed,
          rights,
        }),
      })
    }

    setPercent(percentage)
    setDays(length)
    setDuration(daysToMonths(length))
  }

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading])

  return (
    <>
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
        }}
      />

      <input
        ref={register}
        type="hidden"
        value={duration}
        name={`periods[${currentIndex}].duration`}
      />

      <input
        ref={register}
        type="hidden"
        value={days}
        name={`periods[${currentIndex}].days`}
      />

      <input
        ref={register}
        type="hidden"
        value={percent}
        name={`periods[${currentIndex}].percentage`}
      />
    </>
  )
}
