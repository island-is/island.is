import { useState } from 'react'
import { ApolloError, useQuery } from '@apollo/client'
import { PAYMENT_STATUS } from './queries.graphql'
import { ApplicationPayment } from '../../../types/schema'

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
