import { useEffect } from 'react'
import { Controller, useFormContext, RegisterOptions } from 'react-hook-form'
import {
  Select,
  SelectProps,
  Option,
  InputBackgroundColor,
  Input,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { MultiValue, SingleValue } from 'react-select'
import { clearInputsOnChange, setInputsOnChange } from '@island.is/shared/utils'

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
  isLoading?: boolean
  isMulti?: IsMulti
  required?: boolean
  rules?: RegisterOptions
  size?: 'xs' | 'sm' | 'md'
  internalKey?: string
  filterConfig?: SelectProps<Value, IsMulti>['filterConfig']
  clearOnChange?: string[]
  clearOnChangeDefaultValue?:
    | string
    | string[]
    | boolean
    | boolean[]
    | number
    | number[]
    | undefined
  readOnly?: boolean
  setOnChange?:
    | { key: string; value: any }[]
    | ((
        optionValue: MultiValue<Value> | SingleValue<Value> | undefined,
      ) => Promise<{ key: string; value: any }[]>)
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
  isLoading,
  dataTestId,
  required = false,
  rules,
  size,
  internalKey,
  filterConfig,
  clearOnChange,
  clearOnChangeDefaultValue,
  setOnChange,
  readOnly,
}: SelectControllerProps<Value, IsMulti> & TestSupport) => {
  const { clearErrors, setValue, getValues } = useFormContext()

  const isMultiValue = (
    value: MultiValue<Option<Value>> | SingleValue<Option<Value>>,
  ): value is MultiValue<Option<Value>> => {
    return Array.isArray(value)
  }

  // Clean up invalid values when options change
  useEffect(() => {
    const currentValue = getValues(id)

    if (
      currentValue === null ||
      currentValue === undefined ||
      options.length === 0
    ) {
      return
    }

    if (Array.isArray(currentValue)) {
      const validValues = currentValue.filter((v) =>
        options.some((option) => option.value === v),
      )
      if (validValues.length !== currentValue.length) {
        setValue(id, validValues.length > 0 ? validValues : null)
      }
    } else {
      const foundOption = options.find(
        (option) => option.value === currentValue,
      )
      if (!foundOption) {
        setValue(id, null)
      }
    }
  }, [options, id, setValue, getValues])

  const getValue = (value: Value | Value[]) => {
    if (value === null) {
      return null
    }

    if (Array.isArray(value)) {
      return value
        .map((v) => options.find((option) => option.value === v))
        .filter(Boolean) as Option<Value>[]
    }

    // Return null if the value is not in the options to avoid hung values
    const foundOption = options.find((option) => option.value === value) || null
    return foundOption
  }

  if (readOnly) {
    return (
      <Controller
        {...(defaultValue !== undefined && { defaultValue })}
        name={name}
        rules={rules}
        render={() => {
          return (
            <Input
              id={id}
              name={name}
              disabled={disabled}
              readOnly={true}
              label={label}
              backgroundColor={backgroundColor}
              data-testid={dataTestId}
              hasError={error !== undefined}
              errorMessage={error}
              required={required}
              defaultValue={
                typeof defaultValue === 'string' ? defaultValue : undefined
              }
            />
          )
        }}
      />
    )
  }

  return (
    <Controller
      {...(defaultValue !== undefined && { defaultValue })}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => {
        return (
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
            filterConfig={filterConfig}
            isMulti={isMulti}
            isClearable={isClearable}
            isLoading={isLoading}
            size={size}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            onChange={async (newVal) => {
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

              if (clearOnChange) {
                clearInputsOnChange(
                  clearOnChange,
                  setValue,
                  clearOnChangeDefaultValue,
                )
              }

              if (isClearable && newVal === null) {
                clearInputsOnChange([id], setValue)
              }

              if (setOnChange) {
                setInputsOnChange(
                  typeof setOnChange === 'function'
                    ? await setOnChange(
                        isMultiValue(newVal)
                          ? newVal?.map((v) => v.value)
                          : newVal?.value,
                      )
                    : setOnChange,
                  setValue,
                )
              }
            }}
          />
        )
      }}
    />
  )
}

export default SelectController
