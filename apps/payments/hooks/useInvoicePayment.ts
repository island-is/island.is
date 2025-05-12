import { useState, useCallback } from 'react'
import { CardErrorCode } from '@island.is/shared/constants'
import { useCreateInvoiceMutation } from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'

interface UseInvoicePaymentProps {
  paymentFlowId: string | undefined
  onPaymentSuccess: () => void
  onPaymentError: (error: PaymentError) => void
}

export const useInvoicePayment = ({
  paymentFlowId,
  onPaymentSuccess,
  onPaymentError,
}: UseInvoicePaymentProps) => {
  const [createInvoiceMutationHook, { loading: createInvoiceLoading }] =
    useCreateInvoiceMutation()
  // Removed local isProcessing as createInvoiceLoading from the mutation hook can be used directly

  const processInvoicePayment = useCallback(async () => {
    if (!paymentFlowId) {
      onPaymentError({ code: CardErrorCode.GenericDecline })
      return
    }

    // setIsProcessing(true); // Not needed if using createInvoiceLoading directly
    try {
      const response = await createInvoiceMutationHook({
        variables: {
          input: {
            paymentFlowId: paymentFlowId,
          },
        },
      })

      if (!response.data?.paymentsCreateInvoice.isSuccess) {
        // TODO: Extract more specific error from response if available
        throw new Error(CardErrorCode.GenericDecline)
      }
      onPaymentSuccess()
    } catch (e: any) {
      onPaymentError({
        code: (e.message as CardErrorCode) || CardErrorCode.UnknownCardError,
      })
    } finally {
      // setIsProcessing(false); // Not needed
    }
  }, [
    paymentFlowId,
    createInvoiceMutationHook,
    onPaymentSuccess,
    onPaymentError,
  ])

  return {
    processInvoicePayment,
    isInvoicePaymentProcessing: createInvoiceLoading, // Directly use loading state from mutation
  }
}
