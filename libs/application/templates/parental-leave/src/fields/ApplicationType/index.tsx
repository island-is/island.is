import React, { FC } from 'react'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioFormField } from '@island.is/application/ui-fields'
import { useFormContext } from 'react-hook-form'
import { getApplicationTypeOptions } from '../../lib/parentalLeaveUtils'

export const ApplicationType: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { id, title } = field
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <Box>
      <Text variant="h4" as="h4">
        {formatText(title, application, formatMessage)}
      </Text>
      <RadioFormField
        error={errors && getErrorViaPath(errors, id)}
        field={{
          id: id,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          title,
          children: undefined,
          options: getApplicationTypeOptions(formatMessage),
        }}
        application={application}
      />
    </Box>
  )
}
