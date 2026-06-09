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
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectStatus, isComingFromRedirect } from './util'
import { useSearchParams } from 'react-router-dom'
import cn from 'classnames'

const divWithSmallText = cn(getTextStyles({ variant: 'small' }))

const SUBMISSION_RESERVATION_TTL = 15 * 60 * 1000

const getSubmissionReservationKey = (
  applicationId: string,
  event: DefaultEvents,
) => `application-payment-pending-submit:${applicationId}:${event}`

type SubmissionReservation = {
  ts: number
  token: string
}

const getSubmissionReservation = (
  key: string,
): SubmissionReservation | undefined => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const reservation = window.localStorage.getItem(key)

    if (!reservation) {
      return
    }

    const reservedAt = Number(reservation)

    if (Number.isFinite(reservedAt)) {
      return { ts: reservedAt, token: '' }
    }

    const parsedReservation = JSON.parse(reservation) as SubmissionReservation

    if (
      !Number.isFinite(parsedReservation.ts) ||
      typeof parsedReservation.token !== 'string'
    ) {
      return
    }

    return parsedReservation
  } catch {
    return
  }
}

const isActiveSubmissionReservation = (
  reservation?: SubmissionReservation,
): boolean =>
  !!reservation &&
  Number.isFinite(reservation.ts) &&
  Number(Date.now()) - reservation.ts < SUBMISSION_RESERVATION_TTL

const createSubmissionReservationToken = () =>
  `${Number(Date.now())}-${Math.random().toString(36).slice(2)}`

const reserveSubmission = (key: string, force = false): boolean => {
  if (typeof window === 'undefined') {
    return true
  }

  try {
    if (
      !force &&
      isActiveSubmissionReservation(getSubmissionReservation(key))
    ) {
      return false
    }

    const reservation = {
      ts: Number(Date.now()),
      token: createSubmissionReservationToken(),
    }

    window.localStorage.setItem(key, JSON.stringify(reservation))

    const storedReservation = getSubmissionReservation(key)

    return (
      storedReservation?.token === reservation.token &&
      isActiveSubmissionReservation(storedReservation)
    )
  } catch {
    return true
  }
}

const claimSubmissionReservation = (
  key: string,
  refetch: FieldBaseProps['refetch'],
): boolean => {
  if (reserveSubmission(key)) {
    return true
  }

  if (
    !isActiveSubmissionReservation(getSubmissionReservation(key)) &&
    reserveSubmission(key, true)
  ) {
    return true
  }

  refetch?.()
  return false
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

      if (!claimSubmissionReservation(reservationKey, refetch)) {
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

    if (!claimSubmissionReservation(reservationKey, refetch)) {
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
