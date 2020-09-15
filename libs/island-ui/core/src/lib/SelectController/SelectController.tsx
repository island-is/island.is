import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Select, Option } from '../Select/Select'

interface Props {
  error?: string
  id: string
  name?: string
  label: string
  options?: Option[]
  placeholder?: string
}
export const SelectController: FC<Props> = ({
  error,
  id,
  name = id,
  label,
  options = [],
  placeholder,
}) => {
  const { clearErrors } = useFormContext()
  return (
    <Controller
      defaultValue=""
      name={name}
      render={({ onChange, value }) => (
        <Select
          hasError={error !== undefined}
          id={id}
          errorMessage={error}
          name={name}
          options={options}
          label={label}
          placeholder={placeholder}
          value={options.find((option) => option.value === value)}
          onChange={(newVal) => {
            clearErrors(id)
            onChange((newVal as Option).value)
          }}
        />
      )}
    />
  )
}

export default SelectController
