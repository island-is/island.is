import React, { FC } from 'react'
import { Controller, useFormContext, ValidationRule } from 'react-hook-form'
import { Select, Option, InputBackgroundColor } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'

interface Props {
  error?: string
  id: string
  defaultValue?: unknown
  disabled?: boolean
  name?: string
  label: string
  options?: Option[]
  placeholder?: string
  onSelect?: (s: Option, onChange: (t: unknown) => void) => void
  backgroundColor?: InputBackgroundColor
  isSearchable?: boolean
  required?: boolean
  rules?: ValidationRule
}

export const SelectController: FC<Props & TestSupport> = ({
  error,
  defaultValue,
  disabled = false,
  id,
  name = id,
  label,
  options = [],
  placeholder,
  onSelect,
  backgroundColor,
  isSearchable,
  dataTestId,
  required = false,
  rules,
}) => {
  const { clearErrors } = useFormContext()
  return (
    <Controller
      {...(defaultValue !== undefined && { defaultValue })}
      name={name}
      rules={rules}
      render={({ onChange, value }) => (
        <Select
          required={required}
          backgroundColor={backgroundColor}
          hasError={error !== undefined}
          disabled={disabled}
          id={id}
          errorMessage={error}
          name={name}
          options={options}
          label={label}
          dataTestId={dataTestId}
          placeholder={placeholder}
          value={options.find((option) => option.value === value)}
          isSearchable={isSearchable}
          onChange={(newVal) => {
            clearErrors(id)
            onChange((newVal as Option).value)
            if (onSelect) {
              onSelect(newVal as Option, onChange)
            }
          }}
        />
      )}
    />
  )
}

export default SelectController
