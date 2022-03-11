import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const PaymentUrlNotFoundField: FC<FieldBaseProps> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box paddingTop="smallGutter">
      {' '}
      {formatText(
        m.examplePaymentPendingFieldError,
        application,
        formatMessage,
      )}
    </Box>
  )
}
