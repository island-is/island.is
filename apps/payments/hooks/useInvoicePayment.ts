import { useCallback } from 'react'
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

  const processInvoicePayment = useCallback(async () => {
    if (!paymentFlowId) {
      onPaymentError({ code: CardErrorCode.GenericDecline })
      return
    }

    try {
      const response = await createInvoiceMutationHook({
        variables: {
          input: {
            paymentFlowId: paymentFlowId,
          },
        },
      })

      if (!response.data?.paymentsCreateInvoice.isSuccess) {
        const specific =
          response.data?.paymentsCreateInvoice.responseCode ??
          CardErrorCode.GenericDecline
        throw new Error(specific)
      }
      onPaymentSuccess()
    } catch (e: unknown) {
      onPaymentError({
        code: (e instanceof Error
          ? e.message
          : CardErrorCode.UnknownCardError) as CardErrorCode,
      })
    }
  }, [
    paymentFlowId,
    createInvoiceMutationHook,
    onPaymentSuccess,
    onPaymentError,
  ])

  return {
    processInvoicePayment,
    isInvoicePaymentProcessing: createInvoiceLoading,
  }
}
