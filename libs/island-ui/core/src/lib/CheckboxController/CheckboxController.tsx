import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Box } from '../Box/Box'
import { Checkbox } from '../Checkbox/Checkbox'
import { Stack } from '../Stack/Stack'
import { Tooltip } from '../Tooltip/Tooltip'

interface Option {
  value: string
  label: string
  tooltip?: string
  excludeOthers?: boolean
}
interface CheckboxControllerProps {
  defaultValue?: string[]
  error?: string
  id: string
  name?: string
  options?: Option[]
}
export const CheckboxController: FC<CheckboxControllerProps> = ({
  defaultValue,
  error,
  id,
  name = id,
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
              <Box display="flex" key={`${id}-${index}`}>
                <Checkbox
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
                  errorMessage={index === options.length - 1 && error}
                  hasError={error !== undefined}
                />
                {option.tooltip && (
                  <Box marginLeft={1}>
                    <Tooltip
                      colored={true}
                      placement="top"
                      text={option.tooltip}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )
      }}
    />
  )
}

export default CheckboxController
