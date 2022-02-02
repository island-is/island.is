import { useMutation } from '@apollo/client'
import {
  CustomField,
  DefaultEvents,
  FieldBaseProps,
} from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect } from 'react'
import { usePaymentStatus } from './hooks'
import * as Sentry from '@sentry/react'
import { Box, Text } from '@island.is/island-ui/core'
import { payment } from '../../lib/messages'
import { PaymentError } from './PaymentError'

interface PollingForPaymentProps extends FieldBaseProps {
  field: CustomField
}

export const PollingForPayment: FC<PollingForPaymentProps> = ({
  error,
  application,
  refetch,
}) => {
  const { formatMessage } = useLocale()

  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )

  const [submitApplication, { error: submitError }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => {
        return Sentry.captureException(e.message)
      },
      onCompleted: () => {
        refetch?.()
      },
    },
  )

  // automatically go to done state if payment has been fulfilled
  useEffect(() => {
    if (!paymentStatus.fulfilled) {
      return
    }

    stopPolling()

    submitApplication({
      variables: {
        input: {
          id: application.id,
          event: DefaultEvents.SUBMIT,
          answers: application.answers,
        },
      },
    })
  }, [submitApplication, paymentStatus, stopPolling])

  if (pollingError) {
    return <Text>{formatMessage(payment.labels.paymentPendingFieldError)}</Text>
  }

  if (submitError) {
    return (
      <PaymentError
        title={formatMessage(payment.labels.submitErrorTitle)}
        errorMessage={formatMessage(payment.labels.submitErrorMessage)}
        buttonCaption={formatMessage(payment.labels.submitErrorButtonCaption)}
        onClick={() => refetch?.()}
      />
    )
  }

  return (
    <>
      {error && { error }}
      <Box height="full">
        <Text variant="h3">
          {formatMessage(payment.labels.paymentPendingDescription)}
        </Text>
        <Box marginTop={4}>
          <img
            src="/assets/images/company.svg"
            alt={formatMessage(payment.labels.paymentImage)}
          />
        </Box>
      </Box>
    </>
  )
}
