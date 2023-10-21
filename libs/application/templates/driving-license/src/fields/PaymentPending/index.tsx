import { FC, useEffect } from 'react'
import { getValueViaPath } from '@island.is/application/core'
import {
  CustomField,
  DefaultEvents,
  FieldBaseProps,
} from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectUrl, isComingFromRedirect } from './util'
import { Company } from '../../assets'

export interface Props extends FieldBaseProps {
  field: CustomField
}

export const PaymentPending: FC<Props> = (props) => {
  const { application, refetch } = props
  const msg = useMsg(application)

  const paymentUrl = getValueViaPath<string>(
    application.externalData,
    'createCharge.data.paymentUrl',
  )

  const [submitBack, { error: backError }] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.ABORT,
  })

  const fromRedirect = isComingFromRedirect()

  useEffect(() => {
    if (!fromRedirect && !paymentUrl) {
      submitBack()
    }
  }, [paymentUrl, submitBack, fromRedirect])

  if (!paymentUrl || backError) {
    return (
      <PaymentError
        title={msg(m.submitErrorTitle)}
        errorMessage={msg(m.submitErrorMessage)}
        buttonCaption={msg(m.submitErrorButtonCaption)}
      />
    )
  } else if (isComingFromRedirect()) {
    return <PollingForPayment {...props} />
  } else {
    return (
      <ForwardToPaymentFlow
        url={getRedirectUrl(paymentUrl)}
        message={msg(m.forwardingToPayment)}
      />
    )
  }
}

const ForwardToPaymentFlow: FC<{ url: string; message: string }> = ({
  url,
  message,
}) => {
  useEffect(() => {
    window.document.location.href = url
  }, [url])

  return <Text>{message}</Text>
}

const PollingForPayment: FC<Props> = ({ error, application, refetch }) => {
  const msg = useMsg(application)

  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )

  const [submitApplication, { error: submitError }] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  // automatically go to done state if payment has been fulfilled
  useEffect(() => {
    if (!paymentStatus.fulfilled) {
      return
    }

    stopPolling()

    submitApplication()
  }, [submitApplication, paymentStatus, stopPolling])

  if (pollingError) {
    return <Text>{msg(m.examplePaymentPendingFieldError)}</Text>
  }

  if (submitError) {
    return (
      <PaymentError
        title={msg(m.submitErrorTitle)}
        errorMessage={msg(m.submitErrorMessage)}
        buttonCaption={msg(m.submitErrorButtonCaption)}
        onClick={() => refetch?.()}
      />
    )
  }

  return (
    <>
      {error && { error }}
      <Box>
        <Text variant="h3">{msg(m.paymentPendingDescription)}</Text>
        <Company />
      </Box>
    </>
  )
}

const PaymentError: FC<{
  title: string | string[]
  errorMessage: string | string[]
  buttonCaption: string | string[]
  onClick?: () => unknown
}> = ({ title, errorMessage, buttonCaption, onClick }) => (
  <Box>
    <Text variant="h3">{title}</Text>
    <Text marginBottom="p2">{errorMessage}</Text>
    {onClick && <Button onClick={onClick}>{buttonCaption}</Button>}
  </Box>
)
