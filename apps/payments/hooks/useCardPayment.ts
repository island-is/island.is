import { useRef, useState, useCallback, useEffect } from 'react'
import {
  PaymentsChargeCardInput,
  PaymentsVerifyCardInput,
} from '@island.is/api/schema'
import { CardErrorCode } from '@island.is/shared/constants'
import {
  useVerifyCardMutation,
  useChargeCardMutation,
  VerifyCardMutation,
  ChargeCardMutation,
} from '../graphql/mutations.graphql.generated'
import {
  GetPaymentFlowQuery,
  useGetVerificationStatusLazyQuery,
} from '../graphql/queries.graphql.generated'
import { findProblemInApolloError } from '@island.is/shared/problem'
import { getBrowserInfo } from '../utils/browserInfo'
import { PaymentError } from '../utils/error/error'
import { ApolloError } from '@apollo/client'

interface UseCardPaymentProps {
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow'] | null
  onPaymentSuccess: (paymentMethod: 'card' | 'invoice') => void
  onPaymentError: (error: PaymentError) => void
  setThreeDSecureModalActive: (isActive: boolean) => void
}

interface CardPaymentData {
  cardholderName: string
  number: string
  expiryMonth: number
  expiryYear: number
  cvc: string
}

export const useCardPayment = ({
  paymentFlow,
  onPaymentSuccess,
  onPaymentError,
  setThreeDSecureModalActive,
}: UseCardPaymentProps) => {
  const [verifyCardMutationHook] = useVerifyCardMutation()
  const [chargeCardMutationHook] = useChargeCardMutation()
  const [
    getVerificationStatusQueryHook,
    { loading: verificationStatusLoading },
  ] = useGetVerificationStatusLazyQuery()

  const [isProcessing, setIsProcessing] = useState(false)
  const [threeDSecureDataForModal, setThreeDSecureDataForModal] = useState<
    VerifyCardMutation['paymentsVerifyCard'] | null
  >(null)

  const isVerifyingRef = useRef(false) // For polling loop control

  useEffect(() => {
    return () => {
      isVerifyingRef.current = false
    }
  }, [])

  const waitForCardVerification = useCallback(async () => {
    if (!paymentFlow?.id) {
      throw new Error('Payment flow ID is missing for verification.')
    }

    // Must cover issuer challenges approved in a banking app. Keep in sync with
    // the token and cache expiry in the payments service (cardPayment.config).
    const maximumWaitTimeSeconds = 10 * 60
    let remainingWaitTimeInMilliSeconds = maximumWaitTimeSeconds * 1000
    // Most challenges are answered within the first couple of minutes, poll
    // less often after that (e.g. while the payer approves in a banking app)
    const fastPollingMilliSeconds = 2 * 60 * 1000
    const fastInterval = 5000
    const slowInterval = 15000

    while (remainingWaitTimeInMilliSeconds > 0) {
      const elapsedMilliSeconds =
        maximumWaitTimeSeconds * 1000 - remainingWaitTimeInMilliSeconds
      const interval =
        elapsedMilliSeconds < fastPollingMilliSeconds
          ? fastInterval
          : slowInterval

      if (!isVerifyingRef.current) {
        throw new Error(CardErrorCode.VerificationCancelledByUser)
      }

      const { data } = await getVerificationStatusQueryHook({
        variables: {
          input: {
            id: paymentFlow.id,
          },
        },
        fetchPolicy: 'network-only',
      })

      if (data?.paymentsGetVerificationStatus?.isVerified) {
        return true
      }

      // The 3DS result came back without authentication data (reported by the
      // callback, whether it reached us via the payer's browser or the gateway)
      if (data?.paymentsGetVerificationStatus?.isFailed) {
        throw new Error(CardErrorCode.VerificationFailed)
      }

      await new Promise((resolve) => setTimeout(resolve, interval))
      remainingWaitTimeInMilliSeconds -= interval
    }
    return false // Timeout
  }, [paymentFlow?.id, getVerificationStatusQueryHook, isVerifyingRef])

  const verifyCardApi = useCallback(
    async (
      input: PaymentsVerifyCardInput,
    ): Promise<VerifyCardMutation['paymentsVerifyCard']> => {
      try {
        const { data, errors: gqlErrors } = await verifyCardMutationHook({
          variables: { input },
        })

        if (gqlErrors && gqlErrors.length > 0) {
          const problem = findProblemInApolloError({
            graphQLErrors: gqlErrors,
          } as ApolloError)
          throw new Error(
            (problem?.detail as CardErrorCode) ||
              CardErrorCode.UnknownCardError,
          )
        }

        if (!data?.paymentsVerifyCard) {
          throw new Error(CardErrorCode.UnknownCardError)
        }
        return data.paymentsVerifyCard
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : CardErrorCode.UnknownCardError
        const problem = findProblemInApolloError(e as ApolloError)
        throw new Error(
          (problem?.detail as CardErrorCode) ||
            (message as CardErrorCode) ||
            CardErrorCode.UnknownCardError,
        )
      }
    },
    [verifyCardMutationHook],
  )

  const chargeCardApi = useCallback(
    async (
      input: PaymentsChargeCardInput,
    ): Promise<ChargeCardMutation['paymentsChargeCard']> => {
      try {
        const { data, errors: gqlErrors } = await chargeCardMutationHook({
          variables: { input },
        })

        if (gqlErrors && gqlErrors.length > 0) {
          const problem = findProblemInApolloError({
            graphQLErrors: gqlErrors,
          } as ApolloError)
          throw new Error(
            (problem?.detail as CardErrorCode) ||
              CardErrorCode.UnknownCardError,
          )
        }
        if (!data?.paymentsChargeCard) {
          throw new Error(CardErrorCode.UnknownCardError)
        }
        return data.paymentsChargeCard
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : CardErrorCode.UnknownCardError
        const problem = findProblemInApolloError(e as ApolloError)
        throw new Error(
          (problem?.detail as CardErrorCode) ||
            (message as CardErrorCode) ||
            CardErrorCode.UnknownCardError,
        )
      }
    },
    [chargeCardMutationHook],
  )

  const processCardPayment = useCallback(
    async (cardData: CardPaymentData) => {
      if (!paymentFlow?.id) {
        onPaymentError({ code: CardErrorCode.GenericDecline })
        return
      }
      setIsProcessing(true)
      setThreeDSecureDataForModal(null)
      isVerifyingRef.current = false

      try {
        const verifyCardResponse = await verifyCardApi({
          cardNumber: cardData.number,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          paymentFlowId: paymentFlow.id,
          // 3-D Secure authentication data: who the cardholder is and the
          // browser environment the authentication happens in.
          cardholderName: cardData.cardholderName,
          browserInfo: getBrowserInfo(),
        })

        if (!verifyCardResponse.isSuccess) {
          throw new Error(
            (verifyCardResponse.responseCode as CardErrorCode) ||
              CardErrorCode.GenericDecline,
          )
        }

        setThreeDSecureDataForModal(verifyCardResponse)
        setThreeDSecureModalActive(true)
        isVerifyingRef.current = true

        const isCardVerified = await waitForCardVerification()

        if (!isCardVerified) {
          isVerifyingRef.current = false
          setThreeDSecureModalActive(false)
          throw new Error(CardErrorCode.VerificationDeadlineExceeded)
        }

        const chargeCardResponse = await chargeCardApi({
          cardNumber: cardData.number,
          cvc: cardData.cvc,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          paymentFlowId: paymentFlow.id,
        })

        if (!chargeCardResponse.isSuccess) {
          setThreeDSecureModalActive(false)
          throw new Error(
            (chargeCardResponse.responseCode as CardErrorCode) ||
              CardErrorCode.GenericDecline,
          )
        }

        onPaymentSuccess('card')
      } catch (e: unknown) {
        isVerifyingRef.current = false
        setThreeDSecureModalActive(false)
        onPaymentError({
          code: (e instanceof Error
            ? e.message
            : CardErrorCode.UnknownCardError) as CardErrorCode,
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [
      paymentFlow,
      verifyCardApi,
      chargeCardApi,
      waitForCardVerification,
      onPaymentSuccess,
      onPaymentError,
      setThreeDSecureModalActive,
    ],
  )

  const handleVerificationCancelledByModal = () => {
    isVerifyingRef.current = false
    // Error will be caught by the main try-catch in processCardPayment
    // if polling was active, or user can retry payment.
    // We can set a specific error if not already processing to indicate user cancellation.
    if (!isProcessing) {
      onPaymentError({ code: CardErrorCode.VerificationCancelledByUser })
    }
  }

  return {
    processCardPayment,
    isCardPaymentProcessing: isProcessing,
    threeDSecureDataForModal,
    verificationStatusLoading,
    handleVerificationCancelledByModal,
  }
}
