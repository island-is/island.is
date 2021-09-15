import { MessageDescriptor } from '@formatjs/intl'
import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Slider from '../Slider/Slider'

interface Props {
  id: string
  minValue: number
  maxValue: number
  currentValue: number
  multiplier?: number
  heading: MessageDescriptor
  label: {
    singular: string
    plural: string
  }
  descriptor: JSX.Element
  onChange?: (value: number) => void
}

export const PlanSlider = ({
  id,
  minValue,
  maxValue,
  currentValue,
  multiplier = 1,
  heading,
  label,
  descriptor,
  onChange: onChangeCb,
}: Props) => {
  const { formatMessage } = useLocale()
  const { clearErrors } = useFormContext()
  const [stateValue, setStateValue] = useState<number>(currentValue)

  return (
    <Box
      marginBottom={4}
      marginTop={1}
      paddingTop={6}
      paddingX={3}
      paddingBottom={3}
      background="blue100"
    >
      <Text marginBottom={5} variant="h4">
        {formatMessage(heading)}
      </Text>
      <Box marginBottom={12}>
        <Controller
          defaultValue={stateValue}
          name={id}
          render={({ onChange, value }) => (
            <Slider
              label={label}
              min={minValue / multiplier}
              max={maxValue / multiplier}
              step={1}
              currentIndex={value / multiplier || stateValue / multiplier}
              showMinMaxLabels
              showToolTip
              trackStyle={{ gridTemplateRows: 5 }}
              calculateCellStyle={() => {
                return {
                  background: theme.color.dark200,
                }
              }}
              labelMultiplier={multiplier}
              onChange={(newValue: number) => {
                clearErrors(id)
                onChange(newValue * multiplier)
                setStateValue(newValue * multiplier)
                if (onChangeCb) onChangeCb(newValue * multiplier)
              }}
            />
          )}
        />
      </Box>
      {descriptor}
    </Box>
  )
}
