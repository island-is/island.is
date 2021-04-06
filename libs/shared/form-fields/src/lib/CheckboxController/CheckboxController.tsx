import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox,
  InputError,
  GridRow,
  GridColumn,
  Stack,
  InputBackgroundColor,
} from '@island.is/island-ui/core'

interface Option {
  value: string
  label: React.ReactNode
  subLabel?: string
  tooltip?: React.ReactNode
  disabled?: boolean
  excludeOthers?: boolean
}
interface CheckboxControllerProps {
  defaultValue?: string[]
  disabled?: boolean
  error?: string
  id: string
  name?: string
  large?: boolean
  strong?: boolean
  options?: Option[]
  split?: '1/1' | '1/2' | '1/3' | '1/4'
  backgroundColor?: InputBackgroundColor
  onSelect?: (s: string[]) => void
}
export const CheckboxController: FC<CheckboxControllerProps> = ({
  defaultValue,
  disabled = false,
  error,
  id,
  name = id,
  large,
  strong,
  options = [],
  split = '1/1',
  backgroundColor,
  onSelect = () => undefined,
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
      render={({ value, onChange }) => (
        <GridRow>
          {options.map((option, index) => (
            <GridColumn
              span={['1/1', split]}
              paddingBottom={2}
              key={`option-${option.value}`}
            >
              <Checkbox
                disabled={disabled || option.disabled}
                large={large}
                onChange={() => {
                  clearErrors(id)
                  const newChoices = handleSelect(option, value || [])
                  onChange(newChoices)
                  setValue(id, newChoices)
                  onSelect(newChoices)
                }}
                checked={value && value.includes(option.value)}
                name={`${id}[${index}]`}
                label={option.label}
                strong={strong}
                subLabel={option.subLabel}
                value={option.value}
                hasError={error !== undefined}
                tooltip={option.tooltip}
                backgroundColor={backgroundColor}
              />
            </GridColumn>
          ))}

          {error && (
            <GridColumn span={['1/1', split]} paddingBottom={2}>
              <InputError errorMessage={error} />
            </GridColumn>
          )}
        </GridRow>
      )}
    />
  )
}

export default CheckboxController
