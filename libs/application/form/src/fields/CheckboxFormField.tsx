import React, { FC, useState } from 'react'
import { CheckboxField } from '@island.is/application/schema'
import { Checkbox, Typography, Box, Stack } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({ showFieldName = false, field }) => {
  const { id, name, options } = field
  const { control } = useFormContext()

  const [checkedValues, setCheckedValues] = useState([])

  function handleSelect(option) {
    let newValues = []
    if (option.excludeOthers && !checkedValues.includes(option.value)) {
      newValues = [option.value]
      setCheckedValues(newValues)
      return newValues
    }

    const newNames = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]
    setCheckedValues(newNames)

    console.log('newNames', newNames)

    return newNames
  }

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
                  <Checkbox
                    key={`${id}-${index}`}
                    onChange={() => {
                      onChange(handleSelect(option))
                    }}
                    checked={value && value.includes(option.value)}
                    name={`${id}[${index}]`}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Stack>
            )
          }}
        />
      </Box>
    </div>
  )
}

export default CheckboxFormField
