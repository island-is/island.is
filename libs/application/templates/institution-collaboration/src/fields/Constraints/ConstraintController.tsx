import { Box, Checkbox, Input, Stack } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import React, { FC, useState } from 'react'

interface Props {
  id: string
  checkboxId: string
  label: string
  placeholder?: string
  defaultValue: boolean
  extraText?: boolean
}
const ConstraintController: FC<Props> = ({
  id,
  checkboxId,
  label,
  placeholder,
  defaultValue,
  extraText,
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
      {isChecked && extraText && (
        <Input
          placeholder={placeholder}
          backgroundColor="blue"
          type="text"
          name={id}
          id={id}
          label={label}
          textarea
          rows={5}
          maxLength={250}
          ref={register}
          defaultValue=""
        />
      )}
    </Stack>
  )
}

export default ConstraintController
