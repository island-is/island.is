import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler } from 'react-hook-form'

import {
  PaymentsBankTransferFailureReason,
  PaymentsGetFlowPaymentStatus,
} from '@island.is/api/schema'
import {
  BankTransferErrorCode,
  CardErrorCode,
} from '@island.is/shared/constants'
import { GetPaymentFlowQuery } from '../graphql/queries.graphql.generated'
import { PaymentError } from '../utils/error/error'
import { useCardPayment } from './useCardPayment'
import { useInvoicePayment } from './useInvoicePayment'
import { useApplePay } from './useApplePay'
import { useBankTransferPayment } from './useBankTransferPayment'

interface UsePaymentOrchestrationProps {
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow'] | null
  productInformation: {
    amount: number
    title: string
  }
  isApplePayPaymentEnabledForUser: boolean
}

const deriveInitialBankTransferError = (
  paymentFlow: UsePaymentOrchestrationProps['paymentFlow'],
): PaymentError | null => {
  if (
    paymentFlow?.paymentStatus !==
    PaymentsGetFlowPaymentStatus.bank_transfer_failed
  ) {
    return null
  }
  switch (paymentFlow.lastBankTransferFailure) {
    case PaymentsBankTransferFailureReason.rejected:
      return { code: BankTransferErrorCode.BankTransferRejected }
    case PaymentsBankTransferFailureReason.cancelled:
      return { code: BankTransferErrorCode.BankTransferCancelled }
    case PaymentsBankTransferFailureReason.expired:
      return { code: BankTransferErrorCode.BankTransferExpired }
    default:
      return { code: BankTransferErrorCode.BankTransferGenericError }
  }
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
  const [paymentError, setPaymentError] = useState<PaymentError | null>(() =>
    deriveInitialBankTransferError(paymentFlow),
  )

  const [isThreeDSecureModalActive, setIsThreeDSecureModalActive] =
    useState(false)

  const commonOnPaymentSuccess = useCallback(
    (paymentMethod: 'card' | 'invoice' | 'bank_transfer') => {
      if (paymentMethod === 'invoice') {
        if (
          paymentFlow?.redirectOnInvoiceCreation &&
          paymentFlow?.invoiceReturnUrl
        ) {
          window.location.assign(paymentFlow.invoiceReturnUrl)
        } else {
          router.reload()
        }
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

  const bankTransferPayment = useBankTransferPayment({
    paymentFlowId: paymentFlow?.id,
    onPaymentError: commonOnPaymentError,
  })

  const handleFormSubmit: SubmitHandler<Record<string, string>> = useCallback(
    async (data) => {
      setIsInitiatingSubmit(true)
      setPaymentError(null)

      try {
        if (selectedPaymentMethod === 'card') {
          const { cardholderName, card, cardExpiry, cardCVC } = data
          if (
            !cardholderName ||
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
            cardholderName,
            number: card,
            expiryMonth: Number(month),
            expiryYear: Number(year),
            cvc: cardCVC,
          })
        } else if (selectedPaymentMethod === 'invoice') {
          await invoicePayment.processInvoicePayment()
        } else if (selectedPaymentMethod === 'bank_transfer') {
          const { bankAccountNumber } = data
          if (!bankAccountNumber) {
            setPaymentError({
              code: BankTransferErrorCode.MissingBankAccountNumber,
            })
            setIsInitiatingSubmit(false)
            return
          }
          await bankTransferPayment.processBankTransferPayment(
            bankAccountNumber,
          )
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
    [selectedPaymentMethod, cardPayment, invoicePayment, bankTransferPayment],
  )

  const combinedIsProcessing =
    selectedPaymentMethod === 'card'
      ? cardPayment.isCardPaymentProcessing
      : selectedPaymentMethod === 'invoice'
      ? invoicePayment.isInvoicePaymentProcessing
      : selectedPaymentMethod === 'bank_transfer'
      ? bankTransferPayment.isBankTransferPaymentProcessing
      : false

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
