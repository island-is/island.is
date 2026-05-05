import React, { FC, useEffect, useRef } from 'react'
import { coreErrorMessages, coreMessages } from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectStatus, isComingFromRedirect } from './util'
import { useSearchParams } from 'react-router-dom'

const SUBMISSION_RESERVATION_TTL = 15 * 60 * 1000

const getSubmissionReservationKey = (
  applicationId: string,
  event: DefaultEvents,
) => `application-payment-pending-submit:${applicationId}:${event}`

const reserveSubmission = (key: string): boolean => {
  if (typeof window === 'undefined') {
    return true
  }

  try {
    const reservedAt = Number(window.localStorage.getItem(key))

    if (
      reservedAt &&
      Number.isFinite(reservedAt) &&
      Date.now() - reservedAt < SUBMISSION_RESERVATION_TTL
    ) {
      return false
    }

    window.localStorage.setItem(key, String(Date.now()))
    return true
  } catch {
    return true
  }
}

const clearSubmissionReservation = (key: string) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore browsers that disallow storage access.
  }
}

export interface PaymentPendingProps {
  application: Application
  targetEvent: DefaultEvents
  refetch: FieldBaseProps['refetch']
}

export const PaymentPending: FC<
  React.PropsWithChildren<PaymentPendingProps>
> = ({ application, refetch, targetEvent }) => {
  const msg = useMsg(application)
  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )
  const [, setSearchParams] = useSearchParams()
  const isInvoice = getRedirectStatus() === 'invoice'

  const shouldRedirect = !isComingFromRedirect() && paymentStatus.paymentUrl

  const [submitApplication, { error: submitError }] = useSubmitApplication({
    application,
    refetch,
    event: targetEvent,
  })

  const [submitCancelApplication] = useSubmitApplication({
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
      const reservationKey = getSubmissionReservationKey(
        application.id,
        DefaultEvents.ABORT,
      )

      if (!reserveSubmission(reservationKey)) {
        refetch?.()
        return
      }

      stopPolling()
      hasSubmitted.current = true
      submitCancelApplication()
        .then(() => {
          removeCancelledFromURL()
        })
        .catch(() => {
          hasSubmitted.current = false
          clearSubmissionReservation(reservationKey)
        })
      return
    }

    const reservationKey = getSubmissionReservationKey(
      application.id,
      targetEvent,
    )

    if (!paymentStatus.fulfilled) {
      if (shouldRedirect) {
        window.document.location.href = paymentStatus.paymentUrl
      }
      return
    }

    if (!reserveSubmission(reservationKey)) {
      refetch?.()
      return
    }

    stopPolling()
    hasSubmitted.current = true
    submitApplication().catch(() => {
      hasSubmitted.current = false
      clearSubmissionReservation(reservationKey)
    })
  }, [
    application.id,
    targetEvent,
    refetch,
    submitCancelApplication,
    submitApplication,
    paymentStatus,
    stopPolling,
    shouldRedirect,
    setSearchParams,
  ])

  if (pollingError) {
    return <Text>{msg(coreErrorMessages.paymentStatusError)}</Text>
  }

  if (submitError) {
    return (
      <Box>
        <Box
          marginTop={4}
          display="flex"
          width="full"
          alignItems="center"
          justifyContent="center"
          style={{
            height: 400,
          }}
        >
          <AlertMessage
            type="error"
            title={msg(coreErrorMessages.paymentSubmitFailed)}
            message={msg(coreErrorMessages.paymentSubmitFailedDescription)}
          />
        </Box>
        <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
          <Button
            onClick={() =>
              submitCancelApplication().then(() => {
                window.location.href = window.document.location.href
                  .split('/')
                  .slice(0, -1)
                  .join('/')
              })
            }
          >
            {msg(coreErrorMessages.paymentSubmitRefundExitButtonCaption)}
          </Button>
          <Button onClick={() => refetch?.()}>
            {msg(coreErrorMessages.paymentSubmitRetryButtonCaption)}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box height="full">
      {isInvoice ? (
        <Box marginBottom={4}>
          <Text variant="h3">
            {msg(coreMessages.paymentPendingInvoiceTitle)}
          </Text>
          <Markdown>
            {msg(coreMessages.paymentPendingInvoiceDescription)}
          </Markdown>
        </Box>
      ) : (
        <Text variant="h3">{msg(coreMessages.paymentPollingIndicator)}</Text>
      )}
      <Box
        marginTop={4}
        display="flex"
        width="full"
        alignItems="center"
        justifyContent="center"
        style={{
          height: 400,
        }}
      >
        <LoadingDots size="large" />
      </Box>
    </Box>
  )
}
