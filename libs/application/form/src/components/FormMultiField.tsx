import React, { FC } from 'react'
import { MultiField } from '@island.is/application/schema'
import FormField from './FormField'

const FormMultiField: FC<{
  multiField: MultiField
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
