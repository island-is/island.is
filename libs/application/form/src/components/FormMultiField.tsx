import React, { FC } from 'react'
import FormField from './FormField'
import { MultiFieldScreen } from '../types'

const FormMultiField: FC<{
  multiField: MultiFieldScreen
}> = ({ multiField }) => {
  return (
    <div>
      {multiField.children.map((field, index) => (
        <FormField
          showFieldName
          field={field}
          key={field.id}
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}

export default FormMultiField
