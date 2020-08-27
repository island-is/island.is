import React, { FC } from 'react'
import { TextField } from '@island.is/application/schema'
import { Box, Input } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../../types'
import { useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: TextField
}
const TextFormField: FC<Props> = ({
  autoFocus,
  error,
  field,
  register,
  showFieldName,
}) => {
  const { id, name } = field
  const { clearErrors } = useFormContext()
  return (
    <Box paddingTop={2}>
      <Input
        id={id}
        name={id}
        label={showFieldName ? name : undefined}
        ref={register}
        autoFocus={autoFocus}
        hasError={error !== undefined}
        errorMessage={error}
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
