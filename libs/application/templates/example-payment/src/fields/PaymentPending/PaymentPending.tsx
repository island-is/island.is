import React, { FC, useEffect } from 'react'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useSubmitApplication, usePaymentStatus, useMsg } from './hooks'
import { getRedirectUrl, isComingFromRedirect } from './util'
import { MessageDescriptor } from 'react-intl'

export interface Props extends FieldBaseProps {
  errorMessages: {
    [key in string]: MessageDescriptor
  }
  messages: {
    [key in string]: MessageDescriptor
  }
}

export const PaymentPending: FC<Props> = (props) => {
  return <PollingForPayment {...props} />
}

const PollingForPayment: FC<Props> = ({
  error,
  application,
  refetch,
  errorMessages,
  messages,
}) => {
  const msg = useMsg(application)

  const { paymentStatus, stopPolling, pollingError } = usePaymentStatus(
    application.id,
  )

  const shouldRedirect = !isComingFromRedirect() && paymentStatus.paymentUrl

  const [submitApplication, { error: submitError }] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  // automatically go to done state if payment has been fulfilled
  useEffect(() => {
    if (!paymentStatus.fulfilled) {
      if (shouldRedirect) {
        window.document.location.href = getRedirectUrl(paymentStatus.paymentUrl)
      }

      return
    }

    stopPolling()

    submitApplication()
  }, [submitApplication, paymentStatus, stopPolling, shouldRedirect])

  if (pollingError || error) {
    return <Text>{msg(errorMessages.statusTitle)}</Text>
  }

  if (submitError) {
    return (
      <PaymentError
        title={msg(errorMessages.submitTitle)}
        errorMessage={msg(errorMessages.submitMessage)}
        buttonCaption={msg(errorMessages.submitRetryButtonCaption)}
        onClick={() => refetch?.()}
      />
    )
  }

  return (
    <>
      {error && <Box>{error}</Box>}

      <Box height="full">
        <Text variant="h3">{msg(messages.pollingTitle)}</Text>
        <Box marginTop={4}>
          <img
            src="/assets/images/company.svg"
            alt={msg(messages.pollingTitle)}
          />
        </Box>
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
