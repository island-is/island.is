import React, { FC } from 'react'
import { useQuery, gql } from '@apollo/client'
import { CustomField, FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'

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

  console.log({ paymentStatus })

  if (queryError) {
    return <Text>Villa kom upp við að sækja upplýsingar um greiðslu</Text>
  }

  return (
    <>
      {error && { error }}

      {!paymentStatus.fulfilled && (
        <Box height="full">
          <Text variant="h2">Augnablik meðan beðið er eftir greiðslu</Text>
          <Text marginTop="gutter">Texti um hvað er að gerast</Text>

          <Box
            backgroundPattern="dotted"
            marginTop="gutter"
            paddingTop="p5"
            width="half"
          >
            &nbsp;
          </Box>
        </Box>
      )}
    </>
  )
}
