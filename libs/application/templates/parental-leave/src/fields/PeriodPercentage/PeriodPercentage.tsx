import React, { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'
import parseISO from 'date-fns/parseISO'

import {
  FieldBaseProps,
  FieldComponents,
  CustomField,
  FieldTypes,
  SelectOption,
  StaticTextObject,
} from '@island.is/application/core'
import { SelectFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'

import {
  calculateMaxPercentageForPeriod,
  calculateMinPercentageForPeriod,
  calculatePeriodLength,
} from '../../lib/directorateOfLabour.utils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import {
  getApplicationAnswers,
  getPeriodIndex,
} from '../../lib/parentalLeaveUtils'
import { useRemainingRights } from '../../hooks/useRemainingRights'

export const PeriodPercentage: FC<FieldBaseProps & CustomField> = ({
  field,
  application,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { description } = field
  const { rawPeriods } = getApplicationAnswers(application.answers)
  const currentIndex = getPeriodIndex(field)
  const currentPeriod = rawPeriods[currentIndex]
  const [options, setOptions] = useState<SelectOption<string>[]>([])

  const remainingRights = useRemainingRights(application)

  const { register } = useFormContext()
  const [length, setLength] = useState<string>(
    currentPeriod?.days ? currentPeriod.days : '0',
  )
  const fieldId = `periods[${currentIndex}].ratio`
  const error =
    (errors as FieldErrors<FieldValues>)?.periods?.[currentIndex]?.ratio
      ?.message ?? (errors?.[fieldId] as string)

  useEffect(() => {
    const start = parseISO(currentPeriod.startDate)
    const end = parseISO(currentPeriod.endDate)

    const minPercentage = Math.round(
      calculateMinPercentageForPeriod(start, end) * 100,
    )
    const maxPercentage = Math.round(
      calculateMaxPercentageForPeriod(start, end, remainingRights) * 100,
    )

    if (maxPercentage < minPercentage) {
      return
    }

    const options = new Array(maxPercentage - minPercentage + 1)
      .fill(0)
      .map((_, index) => ({
        value: `${maxPercentage - index}`,
        label: `${maxPercentage - index}%`,
      }))

    setOptions(options)
  }, [currentPeriod, remainingRights])

  const onSelect = (item: SelectOption) => {
    const start = parseISO(currentPeriod.startDate)
    const end = parseISO(currentPeriod.endDate)

    const selectedPercentage = Number(item.value) / 100

    const calculatedLength = calculatePeriodLength(
      start,
      end,
      selectedPercentage,
    )

    setLength(calculatedLength.toString())
  }

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
          onSelect: onSelect,
          options,
          backgroundColor: 'blue',
          defaultValue: null,
        }}
      />

      <input
        readOnly
        ref={register}
        type="hidden"
        value={length}
        name={`periods[${currentIndex}].days`}
      />
    </>
  )
}
