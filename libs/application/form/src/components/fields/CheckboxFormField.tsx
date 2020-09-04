import React, { FC } from 'react'
import { CheckboxField, Option } from '@island.is/application/template'
import {
  Checkbox,
  Typography,
  Box,
  Tooltip,
  Stack,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '../../types'

import { Controller, useFormContext } from 'react-hook-form'
import { getValueViaPath } from '../../utils'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({
  error,
  showFieldName = false,
  field,
  formValue,
}) => {
  const { id, name, options } = field
  const { clearErrors, setValue } = useFormContext()

  function handleSelect(option: Option, checkedValues: string[]) {
    const excludeOptionsLookup = options.map((o) => o.excludeOthers && o.value)

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
          defaultValue={getValueViaPath(formValue, id, [])}
          render={({ value, onChange }) => {
            return (
              <Stack space={2}>
                {options.map((option, index) => (
                  <Box display="flex" key={`${id}-${index}`}>
                    <Checkbox
                      onChange={() => {
                        clearErrors(id)
                        const newChoices = handleSelect(option, value || [])
                        onChange(newChoices)
                        setValue(id, newChoices)
                      }}
                      checked={value && value.includes(option.value)}
                      name={`${id}[${index}]`}
                      label={option.label}
                      value={option.value}
                      errorMessage={index === options.length - 1 && error}
                      hasError={error !== undefined}
                    />
                    {option.tooltip && (
                      <Box marginLeft={1}>
                        <Tooltip
                          colored={true}
                          placement="top"
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
