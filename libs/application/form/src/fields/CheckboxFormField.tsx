import React, { FC } from 'react'
import { CheckboxField } from '@island.is/application/schema'
import { Checkbox, Typography, Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({ showFieldName = false, field }) => {
  const { id, name, options } = field
  const { control } = useFormContext()
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      {options.map((option, index) => {
        return (
          <Box key={option.value} paddingTop={2}>
            <Controller
              name={`${id}[${index}]`}
              control={control}
              render={({ value, onChange }) => {
                const checked = value === option.value
                return (
                  <Checkbox
                    onChange={(e) => {
                      onChange(checked ? undefined : option.value)
                    }}
                    checked={checked}
                    name={`${id}[${index}]`}
                    label={option.label}
                    value={option.value}
                  />
                )
              }}
            />
          </Box>
        )
      })}
    </div>
  )
}

export default CheckboxFormField
