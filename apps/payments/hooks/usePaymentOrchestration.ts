import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'

import { CardErrorCode } from '@island.is/shared/constants'
import { GetPaymentFlowQuery } from '../graphql/queries.graphql.generated'
import { PaymentError } from '../utils/error/error'
import { useCardPayment } from './useCardPayment'
import { useInvoicePayment } from './useInvoicePayment'
import { useApplePay } from './useApplePay'

interface UsePaymentOrchestrationProps {
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow'] | null
  productInformation: {
    amount: number
    title: string
  }
  isApplePayPaymentEnabledForUser: boolean
}

export const usePaymentOrchestration = ({
  paymentFlow,
  productInformation,
  isApplePayPaymentEnabledForUser,
}: UsePaymentOrchestrationProps) => {
  const router = useRouter()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentFlow?.availablePaymentMethods?.[0] ?? '',
  )
  // This local submitting state is for the brief period before a specific hook takes over
  const [isInitiatingSubmit, setIsInitiatingSubmit] = useState(false)
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null)

  const [isThreeDSecureModalActive, setIsThreeDSecureModalActive] =
    useState(false)

  const commonOnPaymentSuccess = useCallback(
    (paymentMethod: 'card' | 'invoice') => {
      // For invoice payments, always reload to show the "invoice created" screen
      if (paymentMethod === 'invoice') {
        router.reload()
        return
      }

      if (paymentFlow?.redirectToReturnUrlOnSuccess && paymentFlow?.returnUrl) {
        window.location.assign(paymentFlow.returnUrl)
      } else {
        router.reload()
      }
    },
    [paymentFlow, router],
  )

  const commonOnPaymentError = useCallback((error: PaymentError) => {
    setPaymentError(error)
    setIsInitiatingSubmit(false) // Reset on error
  }, [])

  const cardPayment = useCardPayment({
    paymentFlow,
    productInformation,
    onPaymentSuccess: commonOnPaymentSuccess,
    onPaymentError: commonOnPaymentError,
    setThreeDSecureModalActive: setIsThreeDSecureModalActive,
  })

  const invoicePayment = useInvoicePayment({
    paymentFlowId: paymentFlow?.id,
    onPaymentSuccess: commonOnPaymentSuccess,
    onPaymentError: commonOnPaymentError,
  })

  const applePayPayment = useApplePay({
    isEnabledForUser: isApplePayPaymentEnabledForUser,
    paymentFlow,
    productInformation,
    onPaymentSuccess: commonOnPaymentSuccess,
    onPaymentError: commonOnPaymentError,
  })

  const handleFormSubmit: SubmitHandler<Record<string, string>> = useCallback(
    async (data) => {
      setIsInitiatingSubmit(true)
      setPaymentError(null)

      try {
        if (selectedPaymentMethod === 'card') {
          const { card, cardExpiry, cardCVC } = data
          if (
            !card ||
            !cardExpiry ||
            typeof cardExpiry !== 'string' ||
            !cardCVC
          ) {
            setPaymentError({ code: CardErrorCode.GenericDecline })
            setIsInitiatingSubmit(false)
            return
          }
          const [month, year] = cardExpiry.split('/')
          await cardPayment.processCardPayment({
            number: card,
            expiryMonth: Number(month),
            expiryYear: Number(year),
            cvc: cardCVC,
          })
        } else if (selectedPaymentMethod === 'invoice') {
          await invoicePayment.processInvoicePayment()
        }
      } catch (e: unknown) {
        if (
          e instanceof Error &&
          e.message !== CardErrorCode.VerificationCancelledByUser
        ) {
          setPaymentError({
            code:
              (e.message as CardErrorCode) || CardErrorCode.UnknownCardError,
          })
        }
        setIsInitiatingSubmit(false)
      }
    },
    [selectedPaymentMethod, cardPayment, invoicePayment],
  )

  const combinedIsProcessing =
    selectedPaymentMethod === 'card'
      ? cardPayment.isCardPaymentProcessing
      : invoicePayment.isInvoicePaymentProcessing

  // Overall submitting state combines the local initiation with the hook's processing state.
  const overallIsSubmitting = isInitiatingSubmit || combinedIsProcessing

  const changePaymentMethod = (newMethod: string) => {
    setPaymentError(null)
    setSelectedPaymentMethod(newMethod)
    setIsInitiatingSubmit(false) // Reset initiation state
  }

  return {
    selectedPaymentMethod,
    changePaymentMethod,
    overallIsSubmitting,
    paymentError,
    setPaymentError, // Expose to allow clearing error from page if needed (e.g. error display component has a dismiss)
    handleFormSubmit,
    isThreeDSecureModalActive,
    threeDSecureDataForModal: cardPayment.threeDSecureDataForModal,
    handleVerificationCancelledByModal:
      cardPayment.handleVerificationCancelledByModal,
    verificationStatusLoading: cardPayment.verificationStatusLoading,
    supportsApplePay: applePayPayment.supportsApplePay ?? false,
    initiateApplePay: applePayPayment.initiateApplePay,
  }
}
