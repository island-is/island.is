import { useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { PAYMENT_STATUS } from '@island.is/application/graphql'

// TODO: import type from somewhere - This is a copy of the type exposed by the graphql api
export interface ApplicationPayment {
  paymentUrl: string
  fulfilled: boolean
}

export interface UsePaymentStatus {
  stopPolling: () => void
  pollingError?: ApolloError
  paymentStatus: ApplicationPayment
}

export const usePaymentStatus = (applicationId: string): UsePaymentStatus => {
  const [continuePolling, setContinuePolling] = useState(true)
  const { data, error } = useQuery(PAYMENT_STATUS, {
    variables: {
      applicationId,
    },
    skip: !continuePolling,
    pollInterval: 4000,
    //Using the default fetchPolicy 'cache-first' will cache the paymentUrl that results in an error from ARK when a payment is requested for a deleted charge.
    fetchPolicy: 'network-only',
  })

  const paymentStatus: ApplicationPayment = data?.applicationPaymentStatus ?? {
    fulfilled: false,
  }

  return {
    pollingError: error,
    stopPolling: () => setContinuePolling(false),
    paymentStatus,
  }
}
