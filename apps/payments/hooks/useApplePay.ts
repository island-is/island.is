import { useCallback, useEffect, useRef, useState } from 'react'

import { CardErrorCode } from '@island.is/shared/constants'

import {
  GetPaymentFlowQuery,
  useGetApplePaySessionLazyQuery,
} from '../graphql/queries.graphql.generated'
import {
  useChargeApplePayMutation,
  ChargeApplePayMutationVariables,
} from '../graphql/mutations.graphql.generated'
import { PaymentError } from '../utils/error/error'
import { PaymentsApplePayChargeInput } from '@island.is/api/schema'

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
    if (process.env.NEXT_PUBLIC_ALLOW_APPLE_PAY === 'false') {
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

  const initiateApplePay = useCallback(() => {
    if (!supportsApplePay || !productInformation) {
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

    sessionRef.current = new window.ApplePaySession(3, paymentRequest)

    sessionRef.current.onvalidatemerchant = async (
      event: ApplePayJS.ApplePayValidateMerchantEvent,
    ) => {
      console.log('On validate merchant', event)

      try {
        // call valitor get session endpoint
        const { data } = await getApplePaySessionQueryHook()
        const session = data?.paymentsGetApplePaySession?.session

        if (!session) {
          throw new Error(CardErrorCode.ErrorGettingApplePaySession)
        }

        const parsedSession = JSON.parse(session)
        console.log('Session data', parsedSession)

        sessionRef.current?.completeMerchantValidation(parsedSession)
      } catch (e) {
        onPaymentError({
          code: (e instanceof Error
            ? e.message
            : CardErrorCode.UnknownCardError) as CardErrorCode,
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
        const { data } = await chargeApplePayMutationHook({
          variables: {
            input: {
              paymentFlowId: paymentFlow?.id ?? '',
              amount: productInformation.amount,
              paymentData: event.payment.token.paymentData,
              paymentMethod: event.payment.token.paymentMethod,
              transactionIdentifier: event.payment.token.transactionIdentifier,
            },
          },
        })

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

        onPaymentError({
          code: (e instanceof Error
            ? e.message
            : CardErrorCode.UnknownCardError) as CardErrorCode,
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
