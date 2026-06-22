import React, { FC, useEffect, useRef } from 'react'
import {
  coreErrorMessages,
  coreMessages,
  getErrorReasonIfPresent,
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
  getTextStyles,
  LoadingDots,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { useLocale } from '@island.is/localization'
import { findProblemInApolloError } from '@island.is/shared/problem'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectStatus, isComingFromRedirect } from './util'
import { useSearchParams } from 'react-router-dom'
import cn from 'classnames'

const divWithSmallText = cn(getTextStyles({ variant: 'small' }))

export interface PaymentPendingProps {
  application: Application
  targetEvent: DefaultEvents
  refetch: FieldBaseProps['refetch']
}

export const PaymentPending: FC<
  React.PropsWithChildren<PaymentPendingProps>
> = ({ application, refetch, targetEvent }) => {
  const msg = useMsg(application)
  const { formatMessage } = useLocale()
  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )
  // Only toast once per distinct submit error (the component can re-render with
  // the same Apollo error).
  const toastedSubmitError = useRef<unknown>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const isInvoice = getRedirectStatus() === 'invoice'

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

  // A post-payment submission failure keeps the generic error screen below, but
  // when the TemplateApiError carries a specific, user-facing reason (a
  // structured provider errorReason) surface it as a toast so the applicant
  // knows *why* the submission failed. Only toast for a real provider error
  // reason — never an extra generic toast on top of the already-generic screen.
  useEffect(() => {
    if (!submitError || toastedSubmitError.current === submitError) {
      return
    }
    const problem = findProblemInApolloError(submitError)
    if (
      problem &&
      'errorReason' in problem &&
      isProviderErrorReason(problem.errorReason)
    ) {
      const { title, summary } = getErrorReasonIfPresent(problem.errorReason)
      toast.error(`${formatMessage(title)}: ${formatMessage(summary)}`)
      toastedSubmitError.current = submitError
    }
  }, [submitError, formatMessage])

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
            message={
              <Box className={divWithSmallText}>
                <Markdown>
                  {msg(
                    coreErrorMessages.paymentSubmitFailedDescriptionMarkdown,
                  )}
                </Markdown>
              </Box>
            }
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
