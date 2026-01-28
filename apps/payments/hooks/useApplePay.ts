import { useCallback, useEffect, useState } from 'react'
import { GetPaymentFlowQuery } from '../graphql/queries.graphql.generated'
import { PaymentError } from '../utils/error/error'
import { CardErrorCode } from '@island.is/shared/constants'

interface UseApplePayProps {
  paymentFlow: GetPaymentFlowQuery['paymentsGetFlow'] | null
  productInformation: {
    amount: number
    title: string
  }
  onPaymentSuccess: (paymentMethod: 'card' | 'invoice') => void
  onPaymentError: (error: PaymentError) => void
}

export const useApplePay = ({
  paymentFlow,
  productInformation,
  onPaymentSuccess,
  onPaymentError,
}: UseApplePayProps) => {
  const [supportsApplePay, setSupportsApplePay] = useState(false)

  // check if apple pay is available
  useEffect(() => {
    // this is by default disabled because Apple pay requires setup locally
    if (process.env.NEXT_PUBLIC_ALLOW_APPLE_PAY === 'false') {
      setSupportsApplePay(false)
      return
    }

    if (typeof window !== 'undefined') {
      const ApplePaySession = (window as any).ApplePaySession

      if (ApplePaySession && ApplePaySession.canMakePayments) {
        const hasCard = paymentFlow?.availablePaymentMethods.includes('card')
        const canUseApplePay = ApplePaySession.canMakePayments()

        if (canUseApplePay && hasCard) {
          setSupportsApplePay(true)
        }
      }
    }
  }, [])

  const initiateApplePay = useCallback(() => {
    if (!supportsApplePay || !productInformation) {
      return
    }

    console.log('initiating apple pay')

    // create apple pay session with payment information
    const session = new (window as any).ApplePaySession(3, {
      countryCode: 'IS',
      currencyCode: 'ISK',
      supportedNetworks: ['visa', 'masterCard'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: productInformation.title,
        amount: productInformation.amount.toString(),
      },
    })

    session.onvalidatemerchant = async (event) => {
      console.log('validatemerchant', event)

      try {
        // call valitor get session endpoint
      } catch (e) {
        onPaymentError({
          code: (e instanceof Error
            ? e.message
            : CardErrorCode.UnknownCardError) as CardErrorCode,
        })
      }

      //session.completeMerchantValidation(valitorSession.session)
    }

    session.onpaymentauthorized = (event) => {
      console.log('paymentauthorized', event)
      // const response = await mockProcessPayment(event.payment.token)

      // // Complete payment based on response
      // session.completePayment({
      //   status: response.success
      //     ? (window as any).ApplePaySession.STATUS_SUCCESS
      //     : (window as any).ApplePaySession.STATUS_FAILURE,
      // })
    }

    session.oncancel = () => {
      console.log('Apple Pay cancelled')
    }

    session.begin()
  }, [supportsApplePay, productInformation])

  return {
    supportsApplePay,
    initiateApplePay,
  }
}
