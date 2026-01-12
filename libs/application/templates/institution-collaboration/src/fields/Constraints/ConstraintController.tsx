import { Box, Checkbox, Input, Stack } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { FC, useState } from 'react'

interface Props {
  id: string
  checkboxId: string
  label: string
  placeholder?: string
  defaultValue?: boolean
  extraText?: boolean
  subLabel?: string
}
const ConstraintController: FC<React.PropsWithChildren<Props>> = ({
  id,
  checkboxId,
  label,
  placeholder,
  defaultValue,
  extraText,
  subLabel,
}) => {
  const { register, setValue } = useFormContext()
  const [isChecked, setIsChecked] = useState(defaultValue)

  const clearTextArea = (value: boolean) => {
    if (!value) {
      setValue(id as string, '')
    }
  }

  return (
    <Stack space={2}>
      <Box background="white">
        <Controller
          name={checkboxId}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(checkboxId as string, e.target.checked)
                  setIsChecked(e.target.checked)
                  clearTextArea(e.target.checked)
                }}
                checked={value}
                name={checkboxId}
                label={label}
                subLabel={subLabel}
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
          required={isChecked}
          type="text"
          {...register(id)}
          id={id}
          label={label}
          textarea
          rows={5}
          maxLength={250}
        />
      )}
    </Stack>
  )
}

export default ConstraintController
