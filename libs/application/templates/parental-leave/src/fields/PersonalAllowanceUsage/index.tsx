import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box } from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/core'
import { TextFormField } from '@island.is/application/ui-fields'

export const PersonalAllowanceUsage: FC<FieldBaseProps> = ({
  application,
  field,
  error,
}) => {
  const { setValue } = useFormContext()
  const { id, width, defaultValue, children, title, description } = field

  return (
    <Box>
      <TextFormField
        application={application}
        error={error}
        showFieldName
        field={{
          id,
          description,
          title,
          width,
          type: FieldTypes.TEXT,
          component: FieldComponents.TEXT,
          children,
          defaultValue,
          variant: 'number',
          backgroundColor: 'blue',
          suffix: '%',
          placeholder: '0%',
        }}
      />
    </Box>
  )
}
