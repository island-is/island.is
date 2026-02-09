import { useCallback, useEffect, useRef, useState } from 'react'
import { ApolloError } from '@apollo/client'

import { CardErrorCode } from '@island.is/shared/constants'
import { findProblemInApolloError } from '@island.is/shared/problem'

import { useChargeApplePayMutation } from '../graphql/mutations.graphql.generated'
import {
  GetPaymentFlowQuery,
  useGetApplePaySessionLazyQuery,
} from '../graphql/queries.graphql.generated'
import { PaymentError } from '../utils/error/error'

const VALID_CARD_ERROR_CODES = new Set<string>(Object.values(CardErrorCode))

function getValidatedCardErrorCode(message: string): CardErrorCode {
  return (
    VALID_CARD_ERROR_CODES.has(message)
      ? message
      : CardErrorCode.UnknownCardError
  ) as CardErrorCode
}

const APPLE_PAY_JS_VERSION = 3

// Extend Window interface to include ApplePaySession
declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession
  }
}

interface UseApplePayProps {
  isEnabledForUser: boolean
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow'] | null
  productInformation: {
    amount: number
    title: string
  }
  onPaymentSuccess: (paymentMethod: 'card' | 'invoice') => void
  onPaymentError: (error: PaymentError) => void
}

interface UseApplePayReturn {
  supportsApplePay: boolean
  initiateApplePay: () => void
}

export const useApplePay = ({
  isEnabledForUser,
  paymentFlow,
  productInformation,
  onPaymentSuccess,
  onPaymentError,
}: UseApplePayProps): UseApplePayReturn => {
  const sessionRef = useRef<ApplePaySession | null>(null)
  const [supportsApplePay, setSupportsApplePay] = useState(false)

  const [chargeApplePayMutationHook] = useChargeApplePayMutation()
  const [getApplePaySessionQueryHook] = useGetApplePaySessionLazyQuery()

  // check if apple pay is available
  useEffect(() => {
    // if apple pay is not enabled or if apple pay is not allowed, set supports apple pay to false
    if (
      process.env.NEXT_PUBLIC_ALLOW_APPLE_PAY === 'false' ||
      !isEnabledForUser
    ) {
      setSupportsApplePay(false)
      return
    }

    if (typeof window !== 'undefined' && window.ApplePaySession) {
      if (window.ApplePaySession.canMakePayments) {
        const hasCard = paymentFlow?.availablePaymentMethods.includes('card')
        const canUseApplePay = window.ApplePaySession.canMakePayments()

        if (canUseApplePay && hasCard) {
          setSupportsApplePay(true)
        }
      }
    }
  }, [isEnabledForUser, paymentFlow])

  // click handler for apple pay button
  const initiateApplePay = useCallback(() => {
    if (!supportsApplePay || !productInformation || !paymentFlow) {
      return
    }

    console.log('initiating apple pay')

    // create apple pay session with payment information
    const paymentRequest: ApplePayJS.ApplePayPaymentRequest = {
      countryCode: 'IS',
      currencyCode: 'ISK',
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: productInformation.title,
        amount: productInformation.amount.toFixed(2),
      },
    }

    sessionRef.current = new window.ApplePaySession(
      APPLE_PAY_JS_VERSION,
      paymentRequest,
    )

    sessionRef.current.onvalidatemerchant = async (
      event: ApplePayJS.ApplePayValidateMerchantEvent,
    ) => {
      console.log('On validate merchant', event)

      try {
        // call valitor get session endpoint
        const { data, error } = await getApplePaySessionQueryHook()
        if (error) {
          const problem = findProblemInApolloError(error)
          throw new Error(
            (problem?.detail as string) ??
              CardErrorCode.ErrorGettingApplePaySession,
          )
        }

        const session = data?.paymentsGetApplePaySession?.session

        if (!session) {
          throw new Error(CardErrorCode.ErrorGettingApplePaySession)
        }

        const parsedSession = JSON.parse(session)
        console.log('Session data', parsedSession)

        sessionRef.current?.completeMerchantValidation(parsedSession)
      } catch (e) {
        const problem = findProblemInApolloError(e as ApolloError)
        const raw =
          problem?.detail ??
          (e instanceof Error ? e.message : CardErrorCode.UnknownCardError)
        onPaymentError({
          code: getValidatedCardErrorCode(String(raw)),
        })
      }
    }

    sessionRef.current.onpaymentmethodselected = (
      event: ApplePayJS.ApplePayPaymentMethodSelectedEvent,
    ) => {
      console.log('On payment method selected', event)
      sessionRef.current?.completePaymentMethodSelection({
        newTotal: {
          label: productInformation.title,
          amount: productInformation.amount.toFixed(2),
        },
      })
    }

    sessionRef.current.onpaymentauthorized = async (
      event: ApplePayJS.ApplePayPaymentAuthorizedEvent,
    ) => {
      console.log('On payment authorized', event)

      try {
        const { data, errors: gqlErrors } = await chargeApplePayMutationHook({
          variables: {
            input: {
              paymentFlowId: paymentFlow.id,
              paymentData: event.payment.token.paymentData,
              paymentMethod: event.payment.token.paymentMethod,
              transactionIdentifier: event.payment.token.transactionIdentifier,
            },
          },
        })

        if (gqlErrors && gqlErrors.length > 0) {
          const problem = findProblemInApolloError({
            graphQLErrors: gqlErrors,
          } as ApolloError)
          throw new Error(
            (problem?.detail as string) ?? CardErrorCode.UnknownCardError,
          )
        }

        if (!data?.paymentsChargeApplePay.isSuccess) {
          throw new Error(
            data?.paymentsChargeApplePay.responseCode ??
              CardErrorCode.UnknownCardError,
          )
        }

        sessionRef.current?.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        })
        onPaymentSuccess('card')
      } catch (e) {
        sessionRef.current?.completePayment({
          status: window.ApplePaySession.STATUS_FAILURE,
        })

        const problem = findProblemInApolloError(e as ApolloError)
        const raw =
          problem?.detail ??
          (e instanceof Error ? e.message : CardErrorCode.UnknownCardError)
        onPaymentError({
          code: getValidatedCardErrorCode(String(raw)),
        })
      }
    }

    sessionRef.current.oncancel = (event: ApplePayJS.Event) => {
      console.log('Apple Pay cancelled', event)
      sessionRef.current = null
    }

    sessionRef.current.begin()
  }, [
    supportsApplePay,
    productInformation,
    paymentFlow,
    onPaymentSuccess,
    onPaymentError,
    chargeApplePayMutationHook,
    getApplePaySessionQueryHook,
  ])

  return {
    supportsApplePay,
    initiateApplePay,
  }
}
