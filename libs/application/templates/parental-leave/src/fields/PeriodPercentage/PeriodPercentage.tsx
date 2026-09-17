import React, { FC, useEffect, useMemo, useState } from 'react'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import parseISO from 'date-fns/parseISO'
import { useFormContext } from 'react-hook-form'

import { getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps, CustomField } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'

import {
  calculatePeriodLength,
  calculateMaxPercentageForPeriod,
  calculateMinPercentageForPeriod,
} from '../../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages, errorMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getPeriodIndex,
  isParentalGrant,
} from '../../lib/parentalLeaveUtils'
import { useRemainingRights } from '../../hooks/useRemainingRights'

type FieldBaseAndCustomField = FieldBaseProps & CustomField

interface PeriodPercentageField extends FieldBaseAndCustomField {
  errors: FieldErrors<FieldValues>
}

export const PeriodPercentage: FC<
  React.PropsWithChildren<PeriodPercentageField>
> = ({ field, application, errors }) => {
  const { formatMessage } = useLocale()
  const { setError, setValue, register, watch } = useFormContext()
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = getPeriodIndex(field)
  const currentPeriod = rawPeriods[currentIndex]

  // Watch form state for dates (setValue from PeriodDateRange may not be in application.answers yet)
  const watchedStartDate = watch(`periods[${currentIndex}].startDate`)
  const watchedEndDate = watch(`periods[${currentIndex}].endDate`)
  const startDate = watchedStartDate || currentPeriod?.startDate
  const endDate = watchedEndDate || currentPeriod?.endDate

  const [selectedValue, setSelectedValue] = useState(currentPeriod?.ratio)
  const [canChooseRemainingDays, setCanChooseRemainingDays] = useState(false)
  const [maxPercentageValue, setMaxPercentageValue] = useState<string>()

  const remainingRights = useRemainingRights(application)

  const fieldId = `periods[${currentIndex}].ratio`

  // Ensure ratio is present in submitted answers even when the user
  // never touches the input, so the server-side answer validator can
  // flag it as missing instead of silently allowing the step to proceed.
  useEffect(() => {
    if (currentIndex >= 0 && !currentPeriod?.ratio) {
      setValue(fieldId, '')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const error =
    getErrorViaPath(errors, `periods.[${currentIndex}].ratio?.message`) ??
    getErrorViaPath(errors, fieldId)

  const { minPercentage, maxPercentage } = useMemo(() => {
    if (!startDate || !endDate) {
      return { minPercentage: 1, maxPercentage: 100 }
    }

    const start = parseISO(startDate)
    const end = parseISO(endDate)

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
      return { minPercentage: 1, maxPercentage: 100 }
    }

    const min = Math.round(rawMinPercentage * 100)
    const max = Math.round(rawMaxPercentage * 100)

    if (max < min) {
      setError(fieldId, {
        type: 'error',
        message: formatMessage(errorMessages.periodsRatioCalculationImpossible),
      })
      return { minPercentage: min, maxPercentage: min }
    }

    const periodLengthWithMaxPercentage = calculatePeriodLength(
      start,
      end,
      max / 100,
    )

    if (periodLengthWithMaxPercentage < remainingRights && max < 100) {
      setCanChooseRemainingDays(true)
      setMaxPercentageValue(`${max + 1}`)
      return { minPercentage: min, maxPercentage: max + 1 }
    }

    return { minPercentage: min, maxPercentage: max }
  }, [startDate, endDate]) // eslint-disable-line react-hooks/exhaustive-deps

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
      <Box marginTop={2}>
        <InputController
          id={fieldId}
          dataTestId="select-percentage-use"
          label={formatMessage(getRatioTitle())}
          placeholder={formatMessage(
            parentalLeaveFormMessages.ratio.placeholder,
          )}
          error={error}
          type="number"
          suffix="%"
          backgroundColor="blue"
          min={minPercentage}
          max={maxPercentage}
          onChange={(e) => {
            setSelectedValue(e.target.value)
          }}
        />
      </Box>

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
