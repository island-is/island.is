import React, { FC } from 'react'
import { CheckboxField, Option } from '@island.is/application/schema'
import {
  Checkbox,
  Typography,
  Box,
  Tooltip,
  Stack,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'

import { Controller, useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({ showFieldName = false, field }) => {
  const { id, name, options } = field
  const { control } = useFormContext()
  const excludeOptionsLookup = options.map((o) => o.excludeOthers && o.value)

  function handleSelect(option: Option, checkedValues: String[]) {
    let newChoices = []
    if (option.excludeOthers && !checkedValues.includes(option.value)) {
      return [option.value]
    }

    newChoices = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]

    newChoices = newChoices.filter(
      (choice) => !excludeOptionsLookup.includes(choice),
    )

    return newChoices
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
                  <Box display="flex" key={`${id}-${index}`}>
                    <Checkbox
                      onChange={() => {
                        onChange(handleSelect(option, value || []))
                      }}
                      checked={value && value.includes(option.value)}
                      name={`${id}[${index}]`}
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

export default CheckboxFormField
