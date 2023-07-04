import { formatText } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { AlertMessageField, FieldBaseProps } from '@island.is/application/types'

interface Props extends FieldBaseProps {
  field: AlertMessageField
}

export const AlertMessageFormField: FC<Props> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginY={2}>
      <AlertMessage
        type={field.alertType ?? 'default'}
        title={formatText(field.title, application, formatMessage)}
        message={
          field.message != null
            ? formatText(field.message, application, formatMessage)
            : null
        }
      />
    </Box>
  )
}
