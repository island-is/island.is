import React, { FC, useMemo, useState } from 'react'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import parseISO from 'date-fns/parseISO'
import { useFormContext } from 'react-hook-form'

import {
  extractRepeaterIndexFromField,
  getErrorViaPath,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
  SelectOption,
  StaticTextObject,
} from '@island.is/application/types'
import { SelectFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'

import {
  calculatePeriodLength,
  calculateMaxPercentageForPeriod,
  calculateMinPercentageForPeriod,
} from '../../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages, errorMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  isParentalGrant,
} from '../../lib/parentalLeaveUtils'
import { useRemainingRights } from '../../hooks/useRemainingRights'
import { StartDateOptions } from '../../constants'

type FieldBaseAndCustomField = FieldBaseProps & CustomField

interface PeriodPercentageField extends FieldBaseAndCustomField {
  errors: FieldErrors<FieldValues>
}

export const PeriodPercentage: FC<
  React.PropsWithChildren<PeriodPercentageField>
> = ({ field, application, errors }) => {
  const { formatMessage } = useLocale()
  const { setError, register } = useFormContext()
  const { description } = field
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = extractRepeaterIndexFromField(field)
  const currentPeriod = rawPeriods[currentIndex]
  const [selectedValue, setSelectedValue] = useState(currentPeriod.ratio)
  const [canChooseRemainingDays, setCanChooseRemainingDays] = useState(false)
  const [maxPercentageValue, setMaxPercentageValue] = useState<string>()

  const remainingRights = useRemainingRights(application)

  const fieldId = `periods[${currentIndex}].ratio`

  const error =
    getErrorViaPath(errors, `periods.[${currentIndex}].ratio?.message`) ??
    getErrorViaPath(errors, fieldId)

  const options: SelectOption<string>[] = useMemo(() => {
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
      return []
    }

    const minPercentage = Math.round(rawMinPercentage * 100)
    const maxPercentage = Math.round(rawMaxPercentage * 100)

    if (maxPercentage < minPercentage) {
      setError(fieldId, {
        type: 'error',
        message: formatMessage(errorMessages.periodsRatioCalculationImpossible),
      })
      return []
    }

    const options = new Array(maxPercentage - minPercentage + 1)
      .fill(0)
      .map((_, index) => ({
        value: `${maxPercentage - index}`,
        label: `${maxPercentage - index}%`,
      }))

    const periodLengthWithMaxPercentage = calculatePeriodLength(
      start,
      end,
      maxPercentage / 100,
    )

    if (
      periodLengthWithMaxPercentage < remainingRights &&
      maxPercentage < 100
    ) {
      setCanChooseRemainingDays(true)
      const max = `${maxPercentage + 1}`
      setMaxPercentageValue(max)

      options.splice(0, 0, {
        value: max,
        label: formatMessage(
          parentalLeaveFormMessages.duration.fullyUsedRatio,
          { maxPercentage: max },
        ),
      })
    }

    return options
  }, [])

  const onSelect = (option: SelectOption) => {
    const value = option.value as string

    setSelectedValue(value)
  }

  if (currentIndex < 0) {
    return null
  }

  const isUsingAllRemainingDays =
    canChooseRemainingDays && selectedValue === maxPercentageValue

  const getRatioTitle = () => {
    if (isParentalGrant(application)) {
      return parentalLeaveFormMessages.ratio.grantLabel
    }
    return parentalLeaveFormMessages.ratio.label
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
          title: getRatioTitle,
          dataTestId: 'select-percentage-use',
          placeholder: parentalLeaveFormMessages.ratio.placeholder,
          id: fieldId,
          children: undefined,
          options,
          backgroundColor: 'blue',
          onSelect,
        }}
      />

      <input type="hidden" {...register(`periods[${currentIndex}].ratio`)} />

      {currentPeriod.firstPeriodStart === undefined && (
        <input
          type="hidden"
          {...register(`periods[${currentIndex}].firstPeriodStart`)}
          value={StartDateOptions.SPECIFIC_DATE}
        />
      )}

      {isUsingAllRemainingDays && (
        <input
          type="hidden"
          {...register(`periods[${currentIndex}].daysToUse`)}
          value={remainingRights}
        />
      )}
    </>
  )
}
