import React from 'react'
import { Controller, useFormContext, RegisterOptions } from 'react-hook-form'

import { Select, Option, InputBackgroundColor } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'

interface SelectControllerProps<Value> {
  error?: string
  id: string
  defaultValue?: Value
  disabled?: boolean
  name?: string
  label: string
  options?: Option<Value>[]
  placeholder?: string
  onSelect?: (s: Option<Value>, onChange: (t: unknown) => void) => void
  backgroundColor?: InputBackgroundColor
  isSearchable?: boolean
  required?: boolean
  rules?: RegisterOptions
}

export const SelectController = <Value,>({
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
}: SelectControllerProps<Value> & TestSupport) => {
  const { clearErrors } = useFormContext()
  return (
    <Controller
      {...(defaultValue !== undefined && { defaultValue })}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Select
          required={required}
          backgroundColor={backgroundColor}
          hasError={error !== undefined}
          isDisabled={disabled}
          id={id}
          errorMessage={error}
          name={name}
          options={options}
          label={label}
          dataTestId={dataTestId}
          placeholder={placeholder}
          value={options.find((option) => option.value === value)}
          isSearchable={isSearchable}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          onChange={(newVal) => {
            clearErrors(id)

            onChange(newVal?.value)
            if (onSelect && newVal) {
              onSelect(newVal, onChange)
            }
          }}
        />
      )}
    />
  )
}

export default SelectController
