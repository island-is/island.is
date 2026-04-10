import React, { FC, useEffect, useRef } from 'react'
import {
  coreErrorMessages,
  coreMessages,
  isProviderErrorReason,
} from '@island.is/application/core'
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
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectStatus, isComingFromRedirect } from './util'
import { useSearchParams } from 'react-router-dom'
import { findProblemInApolloError } from '@island.is/shared/problem'

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
        window.document.location.href = paymentStatus.paymentUrl
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
    shouldRedirect,
    setSearchParams,
  ])

  if (pollingError) {
    return <Text>{msg(coreErrorMessages.paymentStatusError)}</Text>
  }

  if (submitError) {
    const problem = findProblemInApolloError(submitError)
    const errorReason =
      problem &&
      'errorReason' in problem &&
      isProviderErrorReason(problem.errorReason)
        ? problem.errorReason
        : null

    const errorTitle = errorReason
      ? typeof errorReason.title === 'string'
        ? errorReason.title
        : msg(errorReason.title)
      : msg(coreErrorMessages.paymentSubmitFailed)

    const errorMessage = errorReason
      ? typeof errorReason.summary === 'string'
        ? errorReason.summary
        : msg(errorReason.summary)
      : msg(coreErrorMessages.paymentSubmitFailedDescription)

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
            title={errorTitle}
            message={errorMessage}
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
      <Text variant="h3">{msg(coreMessages.paymentPollingIndicator)}</Text>
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
