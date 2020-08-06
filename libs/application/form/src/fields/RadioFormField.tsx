import React, { FC } from 'react'
import { RadioField } from '@island.is/application/schema'
import {
  Typography,
  Box,
  RadioButton,
  Stack,
  Tooltip,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'
import { useFormContext, Controller } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: RadioField
}
const RadioFormField: FC<Props> = ({ showFieldName = false, field }) => {
  const { id, name, options } = field
  const { control } = useFormContext()
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      <Box paddingTop={2}>
        <Controller
          name={`${id}`}
          control={control}
          render={({ value, onChange }) => {
            return (
              <Stack space={2}>
                {options.map((option, index) => (
                  <Box display="flex" alignItems="center" key={option.value}>
                    <RadioButton
                      key={`${id}-${index}`}
                      onChange={({ target }) => {
                        onChange(target.value)
                      }}
                      checked={option.value === value}
                      id={`${id}-${index}`}
                      name={`${id}`}
                      label={option.label}
                      value={option.value}
                    />
                    {option.tooltip && (
                      <Box marginLeft={1}>
                        <Tooltip
                          colored={true}
                          placement="top"
                          as="button"
                          text={option.tooltip}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            )
          }}
        />
      </Box>
    </div>
  )
}

export default RadioFormField
