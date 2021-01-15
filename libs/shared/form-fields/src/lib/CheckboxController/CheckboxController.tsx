import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  Checkbox,
  InputError,
  Stack,
  Tooltip,
} from '@island.is/island-ui/core'

interface Option {
  value: string
  label: React.ReactNode
  tooltip?: React.ReactNode
  excludeOthers?: boolean
}
interface CheckboxControllerProps {
  defaultValue?: string[]
  disabled?: boolean
  error?: string
  id: string
  name?: string
  large?: boolean
  options?: Option[]
}
export const CheckboxController: FC<CheckboxControllerProps> = ({
  defaultValue,
  disabled = false,
  error,
  id,
  name = id,
  large,
  options = [],
}) => {
  const { clearErrors, setValue } = useFormContext()

  function handleSelect(option: Option, checkedValues: string[]) {
    const excludeOptionsLookup = options.map((o) => o.excludeOthers && o.value)

    let newChoices = []
    if (option.excludeOthers && !checkedValues.includes(option.value)) {
      return [option.value]
    }

    newChoices = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]

    newChoices = newChoices.filter(
      (choice) => !excludeOptionsLookup.includes(choice),
    )

    return newChoices
  }

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => {
        return (
          <Stack space={2}>
            {options.map((option, index) => (
              <Box display="block" key={`${id}-${index}`}>
                <Checkbox
                  disabled={disabled}
                  large={large}
                  onChange={() => {
                    clearErrors(id)
                    const newChoices = handleSelect(option, value || [])
                    onChange(newChoices)
                    setValue(id, newChoices)
                  }}
                  checked={value && value.includes(option.value)}
                  name={`${id}[${index}]`}
                  label={option.label}
                  value={option.value}
                  hasError={error !== undefined}
                  tooltip={option.tooltip}
                />
              </Box>
            ))}
            {error !== undefined && <InputError errorMessage={error} />}
          </Stack>
        )
      }}
    />
  )
}

export default CheckboxController
