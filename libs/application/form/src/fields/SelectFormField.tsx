import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { SelectField } from '@island.is/application/schema'
import { Typography, Select, Option } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'

interface Props extends FieldBaseProps {
  field: SelectField
}
const SelectFormField: FC<Props> = ({ showFieldName = false, field }) => {
  const { id, name, options, placeholder } = field

  const { control } = useFormContext()
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      <Controller
        control={control}
        name={id}
        render={({ onChange, value }) => (
          <Select
            name={id}
            options={options}
            label={name}
            placeholder={placeholder}
            value={options.find((option) => option.value === value)}
            onChange={(newVal) => onChange((newVal as Option).value)}
          />
        )}
      />
    </div>
  )
}

export default SelectFormField
