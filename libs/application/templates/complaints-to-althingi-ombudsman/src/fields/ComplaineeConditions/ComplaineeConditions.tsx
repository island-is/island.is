import { FieldBaseProps, formatText } from '@island.is/application/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { complainee } from '../../lib/messages'

export const ComplaineeConditions: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()
  const { title } = field

  return (
    <Box>
      <AlertMessage
        type="info"
        title={formatText(title, application, formatMessage)}
        message={formatText(
          complainee.general.conditionsText,
          application,
          formatMessage,
        )}
      />
    </Box>
  )
}
