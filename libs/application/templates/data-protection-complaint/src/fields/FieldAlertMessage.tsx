import { AlertMessage } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'

// TODO: Optional prop to render buttons
export const FieldAlertMessage: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { title, description } = field
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={5}>
      <AlertMessage
        type="info"
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
