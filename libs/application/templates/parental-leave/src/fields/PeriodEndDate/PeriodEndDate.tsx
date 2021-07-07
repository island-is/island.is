import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  getValueViaPath,
  MaybeWithApplicationAndField,
} from '@island.is/application/core'
import { DateFormField } from '@island.is/application/ui-fields'

import {
  getExpectedDateOfBirth,
  getPeriodIndex,
} from '../../lib/parentalLeaveUtils'
import { useGetOrRequestLength } from '../../hooks/useGetOrRequestLength'
import { daysToMonths } from '../../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages } from '../../lib/messages'

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
  const { id, title, props } = field
  const { answers } = application
  const { getLength, loading } = useGetOrRequestLength(application)
  const { register, clearErrors } = useFormContext()
  const expectedDateOfBirth = getExpectedDateOfBirth(application)
  const currentIndex = getPeriodIndex(field)
  const currentStartDateAnswer = getValueViaPath(
    answers,
    `periods[${currentIndex}].startDate`,
    expectedDateOfBirth,
  ) as string
  const [percent, setPercent] = useState<number | undefined>(undefined)
  const [length, setLength] = useState<number>(0)
  const error = errors?.[`periods[${currentIndex}].endDate`] as string

  const handleChange = async (date: string) => {
    clearErrors(id)

    const endDate = new Date(date).toISOString()

    const { length, percentage } = await getLength({
      startDate: currentStartDateAnswer,
      endDate,
    })

    setPercent(percentage)
    setLength(daysToMonths(length))
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
          id: `periods[${currentIndex}].endDate`,
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
        value={length}
        name={`periods[${currentIndex}].duration`}
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
