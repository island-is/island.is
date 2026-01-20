import React from 'react'
import { Checkbox, Box, Stack, Inline, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import useIsMobile from '../../../hooks/useIsMobile/useIsMobile'

export interface MultipleOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MultipleProps {
  id: string
  options: MultipleOption[]
  value?: string[]
  onChange: (value: string[]) => void
  error?: string
  disabled?: boolean
  required?: boolean
  direction?: 'horizontal' | 'vertical'
  maxSelections?: number
}

export const Multiple: React.FC<MultipleProps> = ({
  id,
  options,
  value = [],
  onChange,
  error,
  disabled = false,
  required = false,
  direction = 'vertical',
  maxSelections,
}) => {
  const { formatMessage } = useLocale()
  const isMobile = useIsMobile()

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      if (maxSelections && value.length >= maxSelections) {
        return
      }
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  const checkboxes = options.map((option) => {
    const isChecked = value.includes(option.value)
    const isDisabled = !!(
      disabled ||
      option.disabled ||
      (maxSelections && !isChecked && value.length >= maxSelections)
    )

    return (
      <Checkbox
        key={option.value}
        id={`${id}-${option.value}`}
        name={`${id}-${option.value}`}
        label={option.label}
        checked={isChecked}
        onChange={(e) => handleChange(option.value, e.target.checked)}
        disabled={isDisabled}
        hasError={!!error}
        large
        backgroundColor="blue"
      />
    )
  })

  return (
    <Box>
      <Box marginBottom={2}>
        {maxSelections && (
          <Text variant="small" color="dark300">
            ({formatMessage(m.maxSelections, { count: maxSelections })})
          </Text>
        )}
        {required && (
          <Text variant="small" color="red400">
            {'* ' + formatMessage(m.requiredQuestion)}
          </Text>
        )}
      </Box>
      {direction === 'horizontal' ? (
        <Inline space={2}>{checkboxes}</Inline>
      ) : (
        <Box width={isMobile ? 'full' : 'half'}>
          <Stack space={2}>{checkboxes}</Stack>
        </Box>
      )}
      {error && (
        <Text color="red400" variant="small" marginTop={1}>
          {error}
        </Text>
      )}
    </Box>
  )
}
