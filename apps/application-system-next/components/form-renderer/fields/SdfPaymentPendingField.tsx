'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { coreErrorMessages, coreMessages } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { PAYMENT_STATUS } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

import { useApplicationId } from '../../ApplicationContext'
import type { FieldRendererProps } from '../types'

interface ApplicationPayment {
  paymentUrl: string
  fulfilled: boolean
}

const isComingFromRedirect = () =>
  !!window.document.location.href.match(/\?done$/) ||
  !!window.document.location.href.match(/\?cancelled$/)

const getRedirectStatus = () =>
  window.document.location.href.match(/\?done$/)
    ? 'done'
    : window.document.location.href.match(/\?cancelled$/)
    ? 'cancelled'
    : undefined

const removeCancelledFromHref = () => {
  const href = window.document.location.href
  window.history.replaceState({}, '', href.replace('?cancelled', ''))
}

/**
 * SDF counterpart of the legacy `PaymentPending` (React Router) field. Polls the
 * shared `applicationPaymentStatus` query, redirects to the payment gateway, and
 * — once payment is fulfilled (or cancelled) — drives the XState transition via
 * the SDF `dispatch` (SUBMIT → done, ABORT → draft) instead of the legacy submit
 * mutation. The charge itself is created by `buildPaymentState`'s `CreateChargeApi`
 * on entry to the payment state, so this field only reacts to its status.
 */
export const SdfPaymentPendingField = ({ dispatch }: FieldRendererProps) => {
  const applicationId = useApplicationId()
  const { formatMessage } = useLocale()

  const [continuePolling, setContinuePolling] = useState(true)
  const { data, error: pollingError } = useQuery(PAYMENT_STATUS, {
    variables: { applicationId },
    skip: !continuePolling,
    pollInterval: 4000,
    // 'network-only' avoids caching a stale paymentUrl that errors after the
    // charge is deleted (mirrors the legacy hook).
    fetchPolicy: 'network-only',
  })
  const stopPolling = useCallback(() => setContinuePolling(false), [])

  const paymentStatus: ApplicationPayment = useMemo(
    () =>
      data?.applicationPaymentStatus ?? { fulfilled: false, paymentUrl: '' },
    [data],
  )

  const [submitError, setSubmitError] = useState(false)
  const hasSubmitted = useRef(false)

  const transition = useCallback(
    async (event: DefaultEvents) => {
      try {
        await dispatch?.('SUBMIT', undefined, undefined, event)
      } catch {
        setSubmitError(true)
      }
    },
    [dispatch],
  )

  const shouldRedirect = !isComingFromRedirect() && paymentStatus.paymentUrl

  useEffect(() => {
    if (hasSubmitted.current) return

    if (getRedirectStatus() === 'cancelled') {
      stopPolling()
      hasSubmitted.current = true
      transition(DefaultEvents.ABORT).then(removeCancelledFromHref)
      return
    }

    if (!paymentStatus.fulfilled) {
      if (shouldRedirect) {
        window.document.location.href = paymentStatus.paymentUrl
      }
      return
    }

    stopPolling()
    hasSubmitted.current = true
    transition(DefaultEvents.SUBMIT)
  }, [paymentStatus, shouldRedirect, stopPolling, transition])

  if (pollingError) {
    return <Text>{formatMessage(coreErrorMessages.paymentStatusError)}</Text>
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
          style={{ height: 400 }}
        >
          <AlertMessage
            type="error"
            title={formatMessage(coreErrorMessages.paymentSubmitFailed)}
            message={formatMessage(
              coreErrorMessages.paymentSubmitFailedDescription,
            )}
          />
        </Box>
        <Box display="flex" justifyContent="spaceBetween" marginTop={2}>
          <Button
            onClick={() => {
              hasSubmitted.current = true
              transition(DefaultEvents.ABORT)
            }}
          >
            {formatMessage(
              coreErrorMessages.paymentSubmitRefundExitButtonCaption,
            )}
          </Button>
          <Button
            onClick={() => {
              setSubmitError(false)
              hasSubmitted.current = false
              setContinuePolling(true)
            }}
          >
            {formatMessage(coreErrorMessages.paymentSubmitRetryButtonCaption)}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box height="full">
      <Text variant="h3">
        {formatMessage(coreMessages.paymentPollingIndicator)}
      </Text>
      <Box
        marginTop={4}
        display="flex"
        width="full"
        alignItems="center"
        justifyContent="center"
        style={{ height: 400 }}
      >
        <LoadingDots size="large" />
      </Box>
    </Box>
  )
}
