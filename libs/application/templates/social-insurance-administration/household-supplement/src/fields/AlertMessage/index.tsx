import { AlertMessage, AlertMessageType } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'

type FieldAlertMessageProps = {
  field: {
    props: {
      type: AlertMessageType
    }
  }
}

export const FieldAlertMessage: FC<FieldBaseProps & FieldAlertMessageProps> = ({
  application,
  field,
}) => {
  const { title, description, props } = field
  const { formatMessage } = useLocale()
  const { type } = props
  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type={type ?? 'warning'}
        title={formatText(title, application, formatMessage)}
        message={
          description
            ? formatText(description, application, formatMessage)
            : undefined
        }
      />
    </Box>
  )
}
