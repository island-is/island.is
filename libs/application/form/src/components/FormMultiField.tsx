import React, { FC } from 'react'
import FormField from './FormField'
import { MultiFieldScreen } from '../types'
import { Box } from '@island.is/island-ui/core'

const FormMultiField: FC<{
  multiField: MultiFieldScreen
}> = ({ multiField }) => {
  return (
    <div>
      {multiField.children.map((field, index) => (
        <Box key={field.id} paddingTop={2}>
          <FormField
            showFieldName
            field={field}
            key={field.id}
            autoFocus={index === 0}
          />
        </Box>
      ))}
    </div>
  )
}

export default FormMultiField
