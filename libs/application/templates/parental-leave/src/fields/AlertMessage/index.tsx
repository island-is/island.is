import { AlertMessage } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'

export const FieldAlertMessage: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { title, description } = field
  const { formatMessage } = useLocale()
  return (
    <Box>
      <AlertMessage
        type="warning"
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
