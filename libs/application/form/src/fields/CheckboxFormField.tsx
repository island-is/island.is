import React, { FC } from 'react'
import { CheckboxField } from '@island.is/application/schema'
import { Typography, Checkbox, Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from './types'

interface Props extends FieldBaseProps {
  field: CheckboxField
}
const CheckboxFormField: FC<Props> = ({
  answers,
  showFieldName = false,
  answerQuestion,
  field,
}) => {
  const { id, name, options } = field
  const answer = answers[id] || {}
  return (
    <div>
      {showFieldName && <Typography variant="p">{name}</Typography>}
      {options.map(({ value, label }) => {
        const checked = !!answer[value]
        return (
          <Box key={value} paddingTop={2}>
            <Checkbox
              id={`${id}-${value}`}
              label={label}
              checked={checked}
              onChange={() => {
                answerQuestion({ id, answer: { ...answer, [value]: !checked } })
              }}
            />
          </Box>
        )
      })}
    </div>
  )
}

export default CheckboxFormField
