import React, { FC } from 'react'
import { TextField } from '@island.is/application/template'
import { Box, InputController } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../../types'
import { useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: TextField
}
const TextFormField: FC<Props> = ({
  autoFocus,
  error,
  field,
  showFieldName,
}) => {
  const { id, disabled, name } = field
  const { clearErrors } = useFormContext()
  return (
    <Box paddingTop={2}>
      <InputController
        disabled={disabled}
        id={id}
        label={showFieldName ? name : undefined}
        autoFocus={autoFocus}
        error={error}
        onChange={() => {
          if (error) {
            clearErrors(id)
          }
        }}
      />
    </Box>
  )
}

export default TextFormField
