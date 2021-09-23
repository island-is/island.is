import React, { FC, useEffect, useState } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import {
  CustomField,
  FieldBaseProps,
  formatText,
  DefaultEvents,
} from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'

const QUERY = gql`
  query status($applicationId: String!) {
    applicationPaymentStatus(applicationId: $applicationId) {
      fulfilled
    }
  }
`

interface Props extends FieldBaseProps {
  field: CustomField
}

interface PaymentStatus {
  fulfilled: boolean
}

export const ExamplePaymentPendingField: FC<Props> = ({
  error,
  application,
  refetch,
}) => {
  const applicationId = application.id
  const { formatMessage } = useLocale()
  const [continuePolling, setContinuePolling] = useState(true)
  const [submitError, setSubmitError] = useState(false)

  const { data, error: queryError } = useQuery(QUERY, {
    variables: {
      applicationId,
    },
    skip: !continuePolling,
    pollInterval: 4000,
  })

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const paymentStatus: PaymentStatus = data?.applicationPaymentStatus || {
    fulfilled: false,
  }

  // automatically go to done state if payment has been fulfilled
  useEffect(() => {
    if (!paymentStatus.fulfilled) {
      return
    }

    setContinuePolling(false)

    submitApplication({
      variables: {
        input: {
          id: applicationId,
          event: DefaultEvents.SUBMIT,
          answers: application.answers,
        },
      },
    })
      .then(({ data, errors } = {}) => {
        if (data && !errors?.length) {
          // Takes them to the next state (which loads the relevant form)
          refetch?.()
        } else {
          return Promise.reject()
        }
      })
      .catch(() => {
        setSubmitError(true)
      })
  }, [
    paymentStatus.fulfilled,
    applicationId,
    application.answers,
    refetch,
    submitApplication,
  ])

  if (queryError) {
    return (
      <Text>
        {formatText(
          m.examplePaymentPendingFieldError,
          application,
          formatMessage,
        )}
      </Text>
    )
  }

  if (submitError) {
    return (
      <Box>
        <Text variant="h3">
          {formatText(m.submitErrorTitle, application, formatMessage)}
        </Text>
        <Text marginBottom="p2">
          {formatText(m.submitErrorMessage, application, formatMessage)}
        </Text>
        <Button onClick={() => refetch?.()}>
          {formatText(m.submitErrorButtonCaption, application, formatMessage)}
        </Button>
      </Box>
    )
  }

  return (
    <>
      {error && { error }}
      <Box height="full">
        <Text variant="h3">
          {formatText(m.paymentPendingDescription, application, formatMessage)}
        </Text>
        <Box marginTop={4}>
          <img
            src="/assets/images/company.svg"
            alt={formatText(m.paymentImage, application, formatMessage)}
          />
        </Box>
      </Box>
    </>
  )
}
