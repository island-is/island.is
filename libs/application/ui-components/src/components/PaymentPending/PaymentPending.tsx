import React, { FC, useEffect, useRef } from 'react'
import { coreErrorMessages, coreMessages } from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectStatus, getRedirectUrl, isComingFromRedirect } from './util'
import { Company } from './assets'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export interface PaymentPendingProps {
  application: Application
  targetEvent: DefaultEvents
  refetch: FieldBaseProps['refetch']
}

export const PaymentPending: FC<
  React.PropsWithChildren<PaymentPendingProps>
> = ({ application, refetch, targetEvent }) => {
  const msg = useMsg(application)
  const navigate = useNavigate()
  const location = useLocation()
  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )
  const [searchParams, setSearchParams] = useSearchParams()

  const shouldRedirect = !isComingFromRedirect() && paymentStatus.paymentUrl

  const [submitApplication, { error: submitError }] = useSubmitApplication({
    application,
    refetch,
    event: targetEvent,
  })

  const [submitCancelApplication, { error: submitCancelError }] =
    useSubmitApplication({
      application,
      refetch,
      event: DefaultEvents.ABORT,
    })
  const hasSubmitted = useRef(false)
  // automatically go to done state if payment has been fulfilled
  useEffect(() => {
    const removeCancelledFromURL = () => {
      setSearchParams((params) => {
        params.delete('cancelled')
        return params
      })
    }

    if (hasSubmitted.current) return
    if (getRedirectStatus() === 'cancelled') {
      stopPolling()
      submitCancelApplication().then(() => {
        removeCancelledFromURL()
      })
      hasSubmitted.current = true
    }

    if (!paymentStatus.fulfilled) {
      if (shouldRedirect) {
        window.document.location.href = getRedirectUrl(paymentStatus.paymentUrl)
      }
      return
    }
    stopPolling()
    submitApplication()
    hasSubmitted.current = true
  }, [
    submitCancelApplication,
    submitApplication,
    paymentStatus,
    stopPolling,
    location,
    navigate,
    shouldRedirect,
    setSearchParams,
  ])

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
