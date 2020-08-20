import React, { FC } from 'react'
import FormField from './FormField'
import { MultiFieldScreen } from '../types'
import { Box } from '@island.is/island-ui/core'
import { FormValue } from '@island.is/application/schema'

const FormMultiField: FC<{
  errors: object
  formValue: FormValue
  multiField: MultiFieldScreen
}> = ({ errors, formValue, multiField }) => {
  return (
    <div>
      {multiField.children.map((field, index) => (
        <Box key={field.id} paddingTop={2}>
          <FormField
            showFieldName
            field={field}
            key={field.id}
            autoFocus={index === 0}
            errors={errors}
            formValue={formValue}
          />
        </Box>
      ))}
    </div>
  )
}

export default FormMultiField
