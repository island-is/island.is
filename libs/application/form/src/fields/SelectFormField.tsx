import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { SelectField } from '@island.is/application/schema'
import { Typography, Select, Option, Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'

interface Props extends FieldBaseProps {
  field: SelectField
}
const SelectFormField: FC<Props> = ({
  error,
  showFieldName = false,
  field,
}) => {
  const { id, name, options, placeholder } = field

  const { clearErrors, control } = useFormContext()
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      <Controller
        control={control}
        defaultValue=""
        name={id}
        render={({ onChange, value }) => (
          <Box paddingTop={2}>
            <Select
              hasError={error !== undefined}
              errorMessage={error}
              name={id}
              options={options}
              label={name}
              placeholder={placeholder}
              value={options.find((option) => option.value === value)}
              onChange={(newVal) => {
                clearErrors(id)
                onChange((newVal as Option).value)
              }}
            />
          </Box>
        )}
      />
    </div>
  )
}

export default SelectFormField
