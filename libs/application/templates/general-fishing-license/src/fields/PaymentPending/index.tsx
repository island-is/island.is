import {
  CustomField,
  DefaultEvents,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect } from 'react'
import * as Sentry from '@sentry/react'
import { useMutation } from '@apollo/client'
import { getRedirectUrl, isComingFromRedirect } from '../../utils'
import { payment } from '../../lib/messages'
import { ForwardToPaymentFlow } from './ForwardToPaymentFlow'
import { PaymentError } from './PaymentError'
import { PollingForPayment } from './PollingForPayment'

interface PaymentPendingProps extends FieldBaseProps {
  field: CustomField
}

export const PaymentPending: FC<PaymentPendingProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, refetch } = props

  const paymentUrl = getValueViaPath(
    application.externalData,
    'createCharge.data.paymentUrl',
  ) as string

  const [submitApplication, { error }] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => {
      return Sentry.captureException(e.message)
    },
    onCompleted: () => {
      refetch?.()
    },
  })

  const fromRedirect = isComingFromRedirect()

  useEffect(() => {
    if (!fromRedirect && !paymentUrl) {
      submitApplication({
        variables: {
          input: {
            id: application.id,
            event: DefaultEvents.ABORT,
            answers: application.answers,
          },
        },
      })
    }
  })

  if (!paymentUrl || error) {
    return (
      <PaymentError
        title={formatMessage(payment.labels.submitErrorTitle)}
        errorMessage={formatMessage(payment.labels.submitErrorMessage)}
        buttonCaption={formatMessage(payment.labels.submitErrorButtonCaption)}
      />
    )
  } else if (fromRedirect) {
    return <PollingForPayment {...props} />
  } else {
    return (
      <ForwardToPaymentFlow
        url={getRedirectUrl(paymentUrl)}
        message={formatMessage(payment.labels.forwardingToPayment)}
      />
    )
  }
}
