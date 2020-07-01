import React, { FC } from 'react'
import { RadioField } from '@island.is/application/schema'
import { Typography, RadioButton } from '@island.is/island-ui/core'
import { FieldBaseProps } from './types'

interface Props extends FieldBaseProps {
  field: RadioField
}
const RadioFormField: FC<Props> = ({
  answers,
  showFieldName = false,
  answerQuestion,
  field,
}) => {
  const { id, name, options } = field
  const answer = answers[id]
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      {options.map(({ value, label }) => {
        const checked = answer === value
        return (
          <RadioButton
            key={value}
            id={`${id}-${value}`}
            label={label}
            checked={checked}
            value={value}
            onChange={() => {
              answerQuestion({ id, answer: value })
            }}
          />
        )
      })}
    </div>
  )
}

export default RadioFormField
