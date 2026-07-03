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
  getTextStyles,
  LoadingDots,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { useLocale } from '@island.is/localization'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import {
  getRedirectStatus,
  isComingFromRedirect,
  getSubmitErrorReasonToToast,
} from './util'
import { useSearchParams } from 'react-router-dom'
import cn from 'classnames'

const divWithSmallText = cn(getTextStyles({ variant: 'small' }))

export interface PaymentPendingProps {
  application: Application
  targetEvent: DefaultEvents
  refetch: FieldBaseProps['refetch']
  // Opt-in (default off): surface a failed submit's structured errorReason as a
  // toast. Threaded from buildPaymentState({ showSubmitErrorReason }).
  showSubmitErrorReason?: boolean
}

export const PaymentPending: FC<
  React.PropsWithChildren<PaymentPendingProps>
> = ({ application, refetch, targetEvent, showSubmitErrorReason }) => {
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

  // A post-payment submission failure keeps the generic error screen below. When
  // the consumer opts in (showSubmitErrorReason) and the TemplateApiError carries
  // a specific, user-facing reason, also surface that reason as a toast so the
  // applicant knows *why* the submission failed. Default off, so it never adds an
  // extra toast for templates that haven't opted in.
  useEffect(() => {
    if (toastedSubmitError.current === submitError) {
      return
    }
    const reason = getSubmitErrorReasonToToast(
      submitError,
      showSubmitErrorReason ?? false,
    )
    if (reason) {
      toast.error(
        `${formatMessage(reason.title)}: ${formatMessage(reason.summary)}`,
      )
      toastedSubmitError.current = submitError
    }
  }, [submitError, formatMessage, showSubmitErrorReason])

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
