import React, { FC } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  CustomField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'

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
}) => {
  const applicationId = application.id
  const { formatMessage } = useLocale()
  const { data, error: queryError, loading } = useQuery(QUERY, {
    variables: {
      applicationId,
    },
    pollInterval: 4000,
  })

  const paymentStatus: PaymentStatus = data?.applicationPaymentStatus || {
    fulfilled: false,
  }

  if (queryError) {
    return <Text>{m.examplePaymentPendingFieldError}</Text>
  }

  return (
    <>
      {error && { error }}

      {!paymentStatus.fulfilled && (
        <Box height="full">
          <Text variant="h3">
            {formatText(
              m.paymentPendingDescription,
              application,
              formatMessage,
            )}
          </Text>
          <Box marginTop={4}>
            <img
              src="/assets/images/company.svg"
              alt={formatText(m.paymentImage, application, formatMessage)}
            />
          </Box>
        </Box>
      )}
      {paymentStatus.fulfilled && (
        <Box height="full">
          <Text variant="h3">
            {formatText(m.paymentApprovedContinue, application, formatMessage)}
          </Text>
          <Box marginTop={4}>
            <img
              src="/assets/images/company.svg"
              alt={formatText(m.paymentImage, application, formatMessage)}
            />
          </Box>
        </Box>
      )}
    </>
  )
}
