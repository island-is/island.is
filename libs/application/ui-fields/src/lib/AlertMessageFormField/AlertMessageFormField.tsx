import { formatText } from '@island.is/application/core'
import { AlertMessage, Box, ResponsiveSpace } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { AlertMessageField, FieldBaseProps } from '@island.is/application/types'

interface Props extends FieldBaseProps {
  field: AlertMessageField
  marginTop?: ResponsiveSpace
  marginBottom?: ResponsiveSpace
}

export const AlertMessageFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  marginTop,
  marginBottom,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginTop={marginTop || 2} marginBottom={marginBottom || 2}>
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
