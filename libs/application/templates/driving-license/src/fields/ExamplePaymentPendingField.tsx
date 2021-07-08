import React, { FC } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  CustomField,
  FieldBaseProps,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../lib/messages'

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
          <Text variant="h3">Augnablik meðan beðið er eftir staðfestingu</Text>

          <Box
            backgroundPattern="dotted"
            marginTop="gutter"
            paddingTop="p5"
            width="full"
          >
            &nbsp;
          </Box>
        </Box>
      )}
      {paymentStatus.fulfilled && (
        <Box height="full">
          <Text variant="h3">
            Greiðslan hefur verið staðfest, valið er 'Halda áfram' til að klára
            umsóknina
          </Text>
          <Box
            backgroundPattern="dotted"
            marginTop="gutter"
            paddingTop="p5"
            width="full"
          >
            &nbsp;
          </Box>
        </Box>
      )}
    </>
  )
}
