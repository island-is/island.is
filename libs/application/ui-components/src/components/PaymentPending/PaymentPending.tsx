import React, { FC, useEffect } from 'react'
import {
  Application,
  DefaultEvents,
  FieldBaseProps,
  coreErrorMessages,
  coreMessages,
} from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectUrl, isComingFromRedirect } from './util'
import { Company } from './assets'

export interface PaymentPendingProps {
  application: Application
  targetEvent: DefaultEvents
  refetch: FieldBaseProps['refetch']
}

export const PaymentPending: FC<PaymentPendingProps> = ({
  application,
  refetch,
  targetEvent,
}) => {
  const msg = useMsg(application)

  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )

  const shouldRedirect = !isComingFromRedirect() && paymentStatus.paymentUrl

  const [submitApplication, { error: submitError }] = useSubmitApplication({
    application,
    refetch,
    event: targetEvent,
  })

  // automatically go to done state if payment has been fulfilled
  useEffect(() => {
    if (!paymentStatus.fulfilled) {
      if (shouldRedirect) {
        window.document.location.href = getRedirectUrl(paymentStatus.paymentUrl)
      }

      return
    }

    stopPolling()

    submitApplication()
  }, [submitApplication, paymentStatus, stopPolling, shouldRedirect])

  if (pollingError) {
    return <Text>{msg(coreErrorMessages.paymentStatusError)}</Text>
  }

  if (submitError) {
    return (
      <Box>
        <Text variant="h3">{msg(coreErrorMessages.paymentSubmitFailed)}</Text>
        <Button onClick={() => refetch?.()}>
          {msg(coreErrorMessages.paymentSubmitRetryButtonCaption)}
        </Button>
      </Box>
    )
  }

  return (
    <Box height="full">
      <Text variant="h3">{msg(coreMessages.paymentPollingIndicator)}</Text>
      <Box marginTop={4}>
        <Company altText={msg(coreMessages.paymentPollingIndicator)} />
      </Box>
    </Box>
  )
}
