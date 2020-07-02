import React, { FC, useState } from 'react'
import { TextField } from '@island.is/application/schema'
import { Box, Input } from '@island.is/island-ui/core'
import { FieldBaseProps } from './types'

interface Props extends FieldBaseProps {
  field: TextField
}
const TextFormField: FC<Props> = ({ answers, answerQuestion, field }) => {
  const { id, name } = field
  const answer = answers[id] || ''
  const [value, setValue] = useState(answer)
  return (
    <Box paddingTop={2}>
      <Input
        id={id}
        name={name}
        label={name}
        value={value}
        onBlur={() => {
          console.log('am i valid', field.validate(value))
          answerQuestion({ id, answer: value })
        }}
        onChange={(e) => {
          setValue(e.target.value)
        }}
      />
    </Box>
  )
}

export default TextFormField
