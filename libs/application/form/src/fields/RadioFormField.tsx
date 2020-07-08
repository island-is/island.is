import React, { FC } from 'react'
import { RadioField } from '@island.is/application/schema'
import { Typography, Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from './types'

interface Props extends FieldBaseProps {
  field: RadioField
}
const RadioFormField: FC<Props> = ({
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
              type="radio"
              key={value}
              id={`${id}-${value}`}
              name={id}
              ref={register}
              value={value}
            />
            <label htmlFor={`${id}-${value}`}>{label}</label>
          </Box>
        )
      })}
    </div>
  )
}

export default RadioFormField
