import React, { FC, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, Stack, Input, Checkbox } from '@island.is/island-ui/core'

interface Props {
  id: string
  checkboxId: string
  label: string
  placeholder?: string
  defaultValue: boolean
}

const ConstraintController: FC<Props> = ({
  id,
  checkboxId,
  label,
  placeholder,
  defaultValue,
}) => {
  const { register, setValue } = useFormContext()
  const [isChecked, setIsChecked] = useState(defaultValue)
  return (
    <Stack space={2}>
      <Box background="white">
        <Controller
          name={checkboxId}
          defaultValue={defaultValue}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(checkboxId as string, e.target.checked)
                  setIsChecked(e.target.checked)
                }}
                checked={value}
                name={checkboxId}
                label={label}
                large
              />
            )
          }}
        />
      </Box>
      {isChecked && (
        <Input
          placeholder={placeholder}
          backgroundColor="blue"
          type="text"
          name={id}
          id={id}
          label={label}
          textarea
          ref={register}
        />
      )}
    </Stack>
  )
}

export default ConstraintController
