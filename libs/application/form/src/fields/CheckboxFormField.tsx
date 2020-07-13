import React, { FC } from 'react'
import { CheckboxField } from '@island.is/application/schema'
import { Typography, Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({
  autoFocus,
  showFieldName = false,
  field,
  register,
}) => {
  const { id, name, options } = field
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      {options.map(({ value, label }, index) => {
        return (
          <Box key={value} paddingTop={2}>
            <input
              autoFocus={autoFocus && index === 0}
              type="checkbox"
              value={value}
              name={`${id}[${index}]`}
              id={`${id}-${value}`}
              ref={register()}
            />
            <label htmlFor={`${id}-${value}`}>{label}</label>
          </Box>
        )
      })}
    </div>
  )
}

export default CheckboxFormField
