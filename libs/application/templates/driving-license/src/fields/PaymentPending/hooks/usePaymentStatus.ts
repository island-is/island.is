import { useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { PAYMENT_STATUS } from './queries.graphql'

export interface PaymentStatus {
  fulfilled: boolean
}

export interface UsePaymentStatus {
  stopPolling: () => void
  pollingError?: ApolloError
  paymentStatus: PaymentStatus
}

export const usePaymentStatus = (applicationId: string): UsePaymentStatus => {
  const [continuePolling, setContinuePolling] = useState(true)
  const { data, error } = useQuery(PAYMENT_STATUS, {
    variables: {
      applicationId,
    },
    skip: !continuePolling,
    pollInterval: 4000,
  })

  const paymentStatus: PaymentStatus = data?.applicationPaymentStatus ?? {
    fulfilled: false,
  }

  return {
    pollingError: error,
    stopPolling: () => setContinuePolling(false),
    paymentStatus,
  }
}
