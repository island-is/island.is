import { useCallback, useEffect, useRef, useState } from 'react'
import { ApolloError } from '@apollo/client'

import { PaymentsGooglePayChargeStatus } from '@island.is/api/schema'
import { CardErrorCode } from '@island.is/shared/constants'
import { findProblemInApolloError } from '@island.is/shared/problem'

import { getPublicRuntimeEnv } from '../environments/runtimeEnvironment'
import {
  useChargeGooglePayMutation,
  useChargeGooglePayVerifiedMutation,
  VerifyCardMutation,
} from '../graphql/mutations.graphql.generated'
import { GetPaymentFlowQuery } from '../graphql/queries.graphql.generated'
import { getBrowserInfo } from '../utils/browserInfo'
import { PaymentError } from '../utils/error/error'

// Extend Window interface to include the Google Pay API loaded by pay.js
declare global {
  interface Window {
    google?: typeof google
  }
}

const BASE_REQUEST = {
  apiVersion: 2,
  apiVersionMinor: 0,
}

const BASE_CARD_PAYMENT_METHOD: google.payments.api.IsReadyToPayPaymentMethodSpecification =
  {
    type: 'CARD',
    parameters: {
      // Only a card saved in the Google account, charged after 3-D Secure,
      // until device tokens (CRYPTOGRAM_3DS) are implemented. Valitor charges
      // a device token when it decrypts it, so that flow has to treat the
      // decryption response as the charge, inside the payment saga, and
      // Valitor has yet to confirm how its web decryption call handles one.
      allowedAuthMethods: ['PAN_ONLY'],
      allowedCardNetworks: ['VISA', 'MASTERCARD'],
      // The name is the cardholder for 3-D Secure of a saved card
      billingAddressRequired: true,
      billingAddressParameters: { format: 'MIN' },
    },
  }

const getErrorCode = (e: unknown): CardErrorCode => {
  const problem = findProblemInApolloError(e as ApolloError)
  return ((problem?.detail as CardErrorCode) ||
    (e instanceof Error ? e.message : undefined) ||
    CardErrorCode.UnknownCardError) as CardErrorCode
}

const throwOnGraphQLErrors = (errors?: ReadonlyArray<unknown>) => {
  if (errors && errors.length > 0) {
    const problem = findProblemInApolloError({
      graphQLErrors: errors,
    } as ApolloError)
    throw new Error(
      (problem?.detail as string) ?? CardErrorCode.UnknownCardError,
    )
  }
}

interface UseGooglePayProps {
  isEnabled: boolean
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow'] | null
  productInformation: {
    amount: number
    title: string
  }
  onPaymentSuccess: (paymentMethod: 'card' | 'invoice') => void
  onPaymentError: (error: PaymentError) => void
  completeVerification: (
    verification: VerifyCardMutation['paymentsVerifyCard'],
  ) => Promise<void>
  setThreeDSecureModalActive: (isActive: boolean) => void
}

interface UseGooglePayReturn {
  supportsGooglePay: boolean
  isGooglePayProcessing: boolean
  createGooglePayButton: () => HTMLElement | null
}

export const useGooglePay = ({
  isEnabled,
  paymentFlow,
  productInformation,
  onPaymentSuccess,
  onPaymentError,
  completeVerification,
  setThreeDSecureModalActive,
}: UseGooglePayProps): UseGooglePayReturn => {
  const clientRef = useRef<google.payments.api.PaymentsClient | null>(null)
  const isProcessingRef = useRef(false)
  const [supportsGooglePay, setSupportsGooglePay] = useState(false)
  // The sheet closes as soon as the payer confirms, so the page shows the
  // charge in progress until it succeeds or fails
  const [isProcessing, setIsProcessing] = useState(false)

  const [chargeGooglePayMutationHook] = useChargeGooglePayMutation()
  const [chargeGooglePayVerifiedMutationHook] =
    useChargeGooglePayVerifiedMutation()

  // check if google pay is available
  useEffect(() => {
    const { googlePayEnvironment } = getPublicRuntimeEnv()
    const hasCard = paymentFlow?.availablePaymentMethods.includes('card')

    if (
      !isEnabled ||
      !hasCard ||
      typeof window === 'undefined' ||
      !window.google?.payments?.api
    ) {
      setSupportsGooglePay(false)
      return
    }

    if (!clientRef.current) {
      clientRef.current = new window.google.payments.api.PaymentsClient({
        environment: googlePayEnvironment,
      })
    }

    let isCurrent = true
    clientRef.current
      .isReadyToPay({
        ...BASE_REQUEST,
        allowedPaymentMethods: [BASE_CARD_PAYMENT_METHOD],
      })
      .then(({ result }) => {
        if (isCurrent) {
          setSupportsGooglePay(result)
        }
      })
      .catch((e) => {
        console.error('Error checking Google Pay availability', e)
      })

    return () => {
      isCurrent = false
    }
  }, [isEnabled, paymentFlow])

  // click handler for google pay button
  const initiateGooglePay = useCallback(async () => {
    const client = clientRef.current
    if (!supportsGooglePay || !client || !paymentFlow) {
      return
    }
    if (isProcessingRef.current) {
      return
    }

    const { googlePayMerchantId, googlePayGatewayMerchantId } =
      getPublicRuntimeEnv()

    let paymentData: google.payments.api.PaymentData
    try {
      // Called before any other await so the sheet opens within the click
      paymentData = await client.loadPaymentData({
        ...BASE_REQUEST,
        allowedPaymentMethods: [
          {
            ...BASE_CARD_PAYMENT_METHOD,
            // Valitor decrypts the token, so we never need a PCI DSS
            // attestation with Google for decrypting it ourselves
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'valitor',
                ...(googlePayGatewayMerchantId
                  ? { gatewayMerchantId: googlePayGatewayMerchantId }
                  : {}),
              },
            },
          },
        ],
        // The typings require merchantId, but Google only wants it in
        // production
        merchantInfo: {
          merchantName: 'island.is',
          ...(googlePayMerchantId ? { merchantId: googlePayMerchantId } : {}),
        } as google.payments.api.MerchantInfo,
        transactionInfo: {
          countryCode: 'IS',
          currencyCode: 'ISK',
          totalPriceStatus: 'FINAL',
          totalPriceLabel: productInformation.title,
          totalPrice: productInformation.amount.toFixed(2),
        },
      })
    } catch (e) {
      // The payer closed the sheet
      if ((e as google.payments.api.PaymentsError)?.statusCode === 'CANCELED') {
        return
      }
      console.error('Error loading Google Pay payment data', e)
      onPaymentError({ code: CardErrorCode.UnknownCardError })
      return
    }

    isProcessingRef.current = true
    setIsProcessing(true)
    const token = paymentData.paymentMethodData.tokenizationData.token

    try {
      const { data, errors: gqlErrors } = await chargeGooglePayMutationHook({
        variables: {
          input: {
            paymentFlowId: paymentFlow.id,
            token,
            cardholderName:
              paymentData.paymentMethodData.info?.billingAddress?.name,
            browserInfo: getBrowserInfo(),
          },
        },
      })
      throwOnGraphQLErrors(gqlErrors)

      const charge = data?.paymentsChargeGooglePay
      let payment = charge?.payment

      // A card saved in the Google account passes 3-D Secure first and is
      // then charged with the same token.
      if (
        charge?.status ===
          PaymentsGooglePayChargeStatus.verification_required &&
        charge.verification
      ) {
        await completeVerification(charge.verification)

        const { data: verifiedData, errors: verifiedGqlErrors } =
          await chargeGooglePayVerifiedMutationHook({
            variables: {
              input: { paymentFlowId: paymentFlow.id, token },
            },
          })
        throwOnGraphQLErrors(verifiedGqlErrors)

        payment = verifiedData?.paymentsChargeGooglePayVerified
      }

      if (!payment?.isSuccess) {
        throw new Error(payment?.responseCode || CardErrorCode.UnknownCardError)
      }

      onPaymentSuccess('card')
    } catch (e) {
      setThreeDSecureModalActive(false)
      onPaymentError({ code: getErrorCode(e) })
    } finally {
      isProcessingRef.current = false
      setIsProcessing(false)
    }
  }, [
    supportsGooglePay,
    paymentFlow,
    productInformation,
    onPaymentSuccess,
    onPaymentError,
    completeVerification,
    setThreeDSecureModalActive,
    chargeGooglePayMutationHook,
    chargeGooglePayVerifiedMutationHook,
  ])

  const createGooglePayButton = useCallback(() => {
    if (!supportsGooglePay || !clientRef.current) {
      return null
    }

    return clientRef.current.createButton({
      onClick: () => {
        void initiateGooglePay()
      },
      buttonColor: 'black',
      buttonType: 'plain',
      buttonSizeMode: 'fill',
      buttonRadius: 8,
      allowedPaymentMethods: [BASE_CARD_PAYMENT_METHOD],
    })
  }, [supportsGooglePay, initiateGooglePay])

  return {
    supportsGooglePay,
    isGooglePayProcessing: isProcessing,
    createGooglePayButton,
  }
}
