import React, { FC, useEffect, useState } from 'react'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'
import parseISO from 'date-fns/parseISO'
import { useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
  SelectOption,
  StaticTextObject,
  extractRepeaterIndexFromField,
} from '@island.is/application/core'
import { SelectFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'

import {
  calculateMaxPercentageForPeriod,
  calculateMinPercentageForPeriod,
} from '../../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages, errorMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { useRemainingRights } from '../../hooks/useRemainingRights'
import { StartDateOptions } from '../../constants'

type FieldBaseAndCustomField = FieldBaseProps & CustomField

interface PeriodPercentageField extends FieldBaseAndCustomField {
  errors: FieldErrors<FieldValues>
}

export const PeriodPercentage: FC<PeriodPercentageField> = ({
  field,
  application,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { setError, register } = useFormContext()
  const { description } = field
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = extractRepeaterIndexFromField(field)
  const currentPeriod = rawPeriods[currentIndex]
  const [options, setOptions] = useState<SelectOption<string>[]>([])

  const remainingRights = useRemainingRights(application)

  const fieldId = `periods[${currentIndex}].ratio`

  let error

  if (errors?.periods?.[currentIndex]?.ratio?.message) {
    error = errors?.periods?.[currentIndex]?.ratio?.message
  } else if (errors?.[fieldId]) {
    error = errors?.[fieldId]
  }

  useEffect(() => {
    const start = parseISO(currentPeriod.startDate)
    const end = parseISO(currentPeriod.endDate)

    const rawMinPercentage = calculateMinPercentageForPeriod(start, end)
    const rawMaxPercentage = calculateMaxPercentageForPeriod(
      start,
      end,
      remainingRights,
    )

    if (rawMinPercentage === null || rawMaxPercentage === null) {
      setError(fieldId, {
        type: 'error',
        message: formatMessage(errorMessages.periodsRatioImpossible),
      })
      return
    }

    const minPercentage = Math.round(rawMinPercentage * 100)
    const maxPercentage = Math.round(rawMaxPercentage * 100)

    if (maxPercentage < minPercentage) {
      setError(fieldId, {
        type: 'error',
        message: formatMessage(errorMessages.periodsRatioCalculationImpossible),
      })
      return
    }

    const options = new Array(maxPercentage - minPercentage + 1)
      .fill(0)
      .map((_, index) => ({
        value: `${maxPercentage - index}`,
        label: `${maxPercentage - index}%`,
      }))

    setOptions(options)
  }, [])

  if (currentIndex < 0) {
    return null
  }

  return (
    <>
      {!!description && (
        <Box>
          <FieldDescription
            description={formatMessage(description as StaticTextObject)}
          />
        </Box>
      )}
      <SelectFormField
        application={application}
        error={error}
        field={{
          type: FieldTypes.SELECT,
          component: FieldComponents.SELECT,
          title: parentalLeaveFormMessages.ratio.label,
          placeholder: parentalLeaveFormMessages.ratio.placeholder,
          id: fieldId,
          children: undefined,
          options,
          backgroundColor: 'blue',
          defaultValue: null,
        }}
      />
      {currentPeriod.firstPeriodStart === undefined && (
        <input
          type="hidden"
          ref={register}
          name={`periods[${currentIndex}].firstPeriodStart`}
          value={StartDateOptions.SPECIFIC_DATE}
        />
      )}
    </>
  )
}
