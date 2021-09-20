import React, { FC } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import {
  CustomField,
  FieldBaseProps,
  formatText,
  DefaultEvents,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
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

  const { data, error: queryError } = useQuery(QUERY, {
    variables: {
      applicationId,
    },
    pollInterval: 4000,
  })

  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const paymentStatus: PaymentStatus = data?.applicationPaymentStatus || {
    fulfilled: false,
  }

  if (queryError) {
    return <Text>{m.examplePaymentPendingFieldError}</Text>
  }

  const onSubmit = async () => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: DefaultEvents.SUBMIT,
          answers: application.answers,
        },
      },
    })
    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

  // automatically go to done state if payment has benn fulfilled
  if (paymentStatus.fulfilled) {
    onSubmit()
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
