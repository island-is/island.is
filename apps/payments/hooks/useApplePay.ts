import { useCallback, useEffect, useRef, useState } from 'react'
import { ApolloError } from '@apollo/client'

import { CardErrorCode } from '@island.is/shared/constants'
import { findProblemInApolloError } from '@island.is/shared/problem'

import getConfig from 'next/config'

import {
  useChargeApplePayMutation,
  useValidateApplePayMerchantMutation,
} from '../graphql/mutations.graphql.generated'
import { GetPaymentFlowQuery } from '../graphql/queries.graphql.generated'
import { PaymentError } from '../utils/error/error'

const VALID_CARD_ERROR_CODES = new Set<string>(Object.values(CardErrorCode))

const getValidatedCardErrorCode = (message: string): CardErrorCode => {
  return VALID_CARD_ERROR_CODES.has(message)
    ? (message as CardErrorCode)
    : CardErrorCode.UnknownCardError
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
  const [validateApplePayMerchantMutation] =
    useValidateApplePayMerchantMutation()

  // check if apple pay is available
  useEffect(() => {
    const { publicRuntimeConfig } = getConfig()
    // if apple pay is not enabled or if apple pay is not allowed, set supports apple pay to false
    if (publicRuntimeConfig.allowApplePay !== 'true' || !isEnabledForUser) {
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
      try {
        const { data, errors: gqlErrors } =
          await validateApplePayMerchantMutation({
            variables: {
              input: { validationURL: event.validationURL },
            },
          })
        if (gqlErrors && gqlErrors.length > 0) {
          const problem = findProblemInApolloError({
            graphQLErrors: gqlErrors,
          } as ApolloError)
          throw new Error(
            (problem?.detail as string) ??
              CardErrorCode.ErrorGettingApplePaySession,
          )
        }

        const session = data?.paymentsValidateApplePayMerchant?.session

        if (!session) {
          throw new Error(CardErrorCode.ErrorGettingApplePaySession)
        }

        const parsedSession = JSON.parse(session)

        console.info('Apple Pay merchant validation completed')

        sessionRef.current?.completeMerchantValidation(parsedSession)
      } catch (e) {
        console.error('Apple Pay merchant validation failed', {
          error: e instanceof Error ? e.message : e,
        })

        sessionRef.current?.abort()

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
      _event: ApplePayJS.ApplePayPaymentMethodSelectedEvent,
    ) => {
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
      try {
        const { data, errors: gqlErrors } = await chargeApplePayMutationHook({
          variables: {
            input: {
              paymentFlowId: paymentFlow.id,
              paymentData: event.payment.token.paymentData,
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

        console.info('Apple Pay charge completed')

        sessionRef.current?.completePayment({
          status: window.ApplePaySession.STATUS_SUCCESS,
        })
        onPaymentSuccess('card')
      } catch (e) {
        console.error('Apple Pay charge failed', {
          error: e instanceof Error ? e.message : e,
        })

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

    sessionRef.current.oncancel = () => {
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
    validateApplePayMerchantMutation,
  ])

  return {
    supportsApplePay,
    initiateApplePay,
  }
}
