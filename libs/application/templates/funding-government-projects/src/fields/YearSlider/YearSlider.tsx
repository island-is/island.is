import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Text } from '@island.is/island-ui/core'
import React, { useState } from 'react'
import { useLocale } from '@island.is/localization'
import Slider from '../components/Slider/Slider'
import { shared } from '../../lib/messages'
import { theme } from '@island.is/island-ui/theme'

const minYears = 5
const maxYears = 10

export const YearSlider = ({ field, application }: FieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const currentAnswer = getValueViaPath(
    application.answers,
    field.id,
    5,
  ) as number

  const { clearErrors } = useFormContext()
  const [chosenGivenYears, setChosenGivenYears] =
    useState<number>(currentAnswer)

  return (
    <Box marginBottom={6} marginTop={6}>
      <Text marginBottom={4} variant="h4">
        {formatText(field.title, application, formatMessage)}
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={chosenGivenYears}
          name={id}
          render={({ field: { onChange, value } }) => (
            <Slider
              label={{
                singular: formatMessage(shared.yearSingular),
                plural: formatMessage(shared.yearPlural),
              }}
              min={minYears}
              max={maxYears}
              step={1}
              currentIndex={value || chosenGivenYears}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 5 }}
              calculateCellStyle={() => {
                return {
                  background: theme.color.dark200,
                }
              }}
              onChange={(newValue: number) => {
                clearErrors(id)
                onChange(newValue)
                setChosenGivenYears(newValue)
              }}
            />
          )}
        />
      </Box>
    </Box>
  )
}
