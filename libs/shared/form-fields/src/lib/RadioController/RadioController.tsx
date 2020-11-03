import React, { FC } from 'react'
import { Box, RadioButton, Stack, Tooltip } from '@island.is/island-ui/core'
import { useFormContext, Controller } from 'react-hook-form'

interface Option {
  value: string
  label: string
  tooltip?: string
  excludeOthers?: boolean
}
interface Props {
  defaultValue?: string[]
  disabled?: boolean
  error?: string
  id: string
  name?: string
  options?: Option[]
  largeButtons?: boolean
  emphasize?: boolean
  onSelect?: (s: string) => void
}
export const RadioController: FC<Props> = ({
  defaultValue,
  disabled = false,
  error,
  id,
  name = id,
  options = [],
  largeButtons = false,
  emphasize = false,
  onSelect = () => {},
}) => {
  const { clearErrors, setValue } = useFormContext()
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => {
        return (
          <Stack space={2}>
            {options.map((option, index) => (
              <RadioButton
                large={largeButtons || emphasize}
                filled={emphasize}
                tooltip={option.tooltip}
                key={`${id}-${index}`}
                onChange={({ target }) => {
                  clearErrors(id)
                  onChange(target.value)
                  onSelect(target.value)
                  setValue(id, target.value)
                }}
                checked={option.value === value}
                id={`${id}-${index}`}
                name={`${id}`}
                label={option.label}
                value={option.value}
                disabled={disabled}
                errorMessage={index === options.length - 1 ? error : undefined}
                hasError={error !== undefined}
              />
            ))}
          </Stack>
        )
      }}
    />
  )
}

export default RadioController
