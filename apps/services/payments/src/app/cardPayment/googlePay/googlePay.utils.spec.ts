import { CardPaymentModuleConfigType } from '../cardPayment.config'
import { generateGooglePayDecryptedChargeRequestOptions } from './googlePay.utils'

const paymentApiConfig = {
  paymentsApiSecret: 'APIKey secret',
  paymentsApiHeaderKey: 'valitorpay-api-version',
  paymentsApiHeaderValue: '2.0',
  systemCalling: 'island.is',
} as CardPaymentModuleConfigType['paymentGateway']

const paymentTrackingData = {
  merchantReferenceData: 'rrn-1',
  correlationId: 'correlation-1',
  paymentDate: new Date(),
}

const paymentMethodDetails = {
  pan: '4111111111111111',
  expirationMonth: 12,
  expirationYear: 2030,
  authMethod: 'CRYPTOGRAM_3DS' as const,
  cryptogram: 'AAAAAA0ZfXkAAAAAAAAAAAAAAAA=',
}

describe('generateGooglePayDecryptedChargeRequestOptions', () => {
  it('builds a GooglePay WalletPayment sale with the decrypted card and cryptogram', () => {
    const options = generateGooglePayDecryptedChargeRequestOptions({
      paymentMethodDetails: { ...paymentMethodDetails, eciIndicator: '05' },
      paymentApiConfig,
      paymentTrackingData,
      amount: 250,
    })

    expect(options.method).toBe('POST')
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'APIKey secret',
      'valitorpay-api-version': '2.0',
    })
    expect(JSON.parse(options.body)).toEqual({
      operation: 'Sale',
      walletPaymentType: 'GooglePay',
      googlePayWalletPayment: {
        decryptedPaymentTokenData: {
          amount: '25000',
          cardNumber: '4111111111111111',
          currency: 'ISK',
          expirationMonth: 12,
          expirationYear: 2030,
          paymentCryptogram: 'AAAAAA0ZfXkAAAAAAAAAAAAAAAA=',
          eci: '05',
        },
      },
      paymentAdditionalData: { merchantReferenceData: 'rrn-1' },
      systemCalling: 'island.is',
      correlationId: 'correlation-1',
    })
  })

  it('omits eci when Google did not supply one', () => {
    const options = generateGooglePayDecryptedChargeRequestOptions({
      paymentMethodDetails,
      paymentApiConfig,
      paymentTrackingData,
      amount: 250,
    })

    expect(
      JSON.parse(options.body).googlePayWalletPayment.decryptedPaymentTokenData,
    ).not.toHaveProperty('eci')
  })
})
