import React, { FC, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Checkbox } from '@island.is/island-ui/core'

const ConfirmCheckbox: FC<FieldBaseProps> = ({ error, field, application }) => {
  const { id, disabled } = field
  const { setValue } = useFormContext()
  const defaultValue = getValueViaPath(application.answers, id) as boolean

  const [isChecked, setChecked] = useState(defaultValue)

  return (
    <Controller
      name={id}
      defaultValue={defaultValue}
      render={() => {
        return (
          <Box
            border="standard"
            borderColor="blue200"
            borderRadius="large"
            padding={3}
          >
            <Checkbox
              id={id}
              disabled={disabled}
              name={`${id}`}
              label="I am ensuring that the information is true and correct"
              hasError={!!error}
              checked={isChecked}
              onChange={() => {
                setChecked(!isChecked)
                setValue(id, !isChecked)
              }}
            />
          </Box>
        )
      }}
    />
  )
}

export default ConfirmCheckbox
