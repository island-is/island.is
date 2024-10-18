import React from 'react'
import { Controller, useFormContext, RegisterOptions } from 'react-hook-form'

import { Select, Option, InputBackgroundColor } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { MultiValue, SingleValue } from 'react-select'

interface SelectControllerProps<Value, IsMulti extends boolean = false> {
  error?: string
  id: string
  defaultValue?: Value
  disabled?: boolean
  name?: string
  label: string
  options?: Option<Value>[]
  placeholder?: string
  onSelect?: (
    s: IsMulti extends true ? MultiValue<Option<Value>> : Option<Value>,
    onChange: (t: unknown) => void,
  ) => void
  backgroundColor?: InputBackgroundColor
  isSearchable?: boolean
  isClearable?: boolean
  isMulti?: IsMulti
  required?: boolean
  rules?: RegisterOptions
  size?: 'xs' | 'sm' | 'md'
  internalKey?: string
}

export const SelectController = <Value, IsMulti extends boolean = false>({
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
  isMulti,
  isClearable = false,
  dataTestId,
  required = false,
  rules,
  size,
  internalKey,
}: SelectControllerProps<Value, IsMulti> & TestSupport) => {
  const { clearErrors } = useFormContext()

  const isMultiValue = (
    value: MultiValue<Option<Value>> | SingleValue<Option<Value>>,
  ): value is MultiValue<Option<Value>> => {
    return Array.isArray(value)
  }

  const getValue = (value: Value | Value[]) => {
    if (value === undefined) {
      return null
    }

    if (Array.isArray(value)) {
      return value
        .map((v) => options.find((option) => option.value === v))
        .filter(Boolean) as Option<Value>[]
    }

    return options.find((option) => option.value === value)
  }

  return (
    <Controller
      {...(defaultValue !== undefined && { defaultValue })}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Select
          key={internalKey}
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
          value={getValue(value)}
          isSearchable={isSearchable}
          isMulti={isMulti}
          isClearable={isClearable}
          size={size}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          onChange={(newVal) => {
            clearErrors(id)

            if (isMultiValue(newVal)) {
              onChange(newVal.map((v) => v.value))
            } else {
              onChange(newVal?.value)
            }

            if (onSelect && newVal) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              onSelect(newVal, onChange)
            }
          }}
        />
      )}
    />
  )
}

export default SelectController
