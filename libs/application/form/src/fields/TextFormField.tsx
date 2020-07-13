import React, { FC } from 'react'
import { TextField } from '@island.is/application/schema'
import { Box, Input } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../types'

interface Props extends FieldBaseProps {
  field: TextField
}
const TextFormField: FC<Props> = ({ autoFocus, field, register }) => {
  const { id, name } = field
  return (
    <Box paddingTop={2}>
      <Input
        id={id}
        name={id}
        label={name}
        ref={register}
        autoFocus={autoFocus}
      />
    </Box>
  )
}

export default TextFormField
