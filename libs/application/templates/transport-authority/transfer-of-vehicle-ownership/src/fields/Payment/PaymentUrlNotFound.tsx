import React, { FC } from 'react'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { payment } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const PaymentUrlNotFound: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  return (
    <Box paddingTop="smallGutter">
      {' '}
      {formatText(
        payment.paymentUrlNotFound.examplePaymentPendingFieldError,
        application,
        formatMessage,
      )}
    </Box>
  )
}
