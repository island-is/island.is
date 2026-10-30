import { CardPaymentModuleConfigType } from '../cardPayment.config'
import {
  generateGooglePayDecryptionRequestOptions,
  generateGooglePaySavedCardChargeRequestOptions,
} from './googlePay.utils'

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

describe('generateGooglePayDecryptionRequestOptions', () => {
  it('builds a GooglePay WalletTransaction with the token as Google sent it', () => {
    const token = {
      signature: 'signature',
      intermediateSigningKey: { signedKey: 'signedKey', signatures: ['sig'] },
      protocolVersion: 'ECv2',
      signedMessage: 'signedMessage',
    }

    const options = generateGooglePayDecryptionRequestOptions({
      token,
      paymentApiConfig,
      correlationId: 'correlation-1',
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
      transactionType: 'WalletTransaction',
      currency: 'ISK',
      amount: 25000,
      Wallet: { WalletType: 'GooglePay', GooglePay: token },
      systemCalling: 'island.is',
      correlationId: 'correlation-1',
    })
  })
})

describe('generateGooglePaySavedCardChargeRequestOptions', () => {
  it('builds an ECommerce CardPayment with the 3-D Secure result and no CVC', () => {
    const options = generateGooglePaySavedCardChargeRequestOptions({
      card: {
        pan: '4111111111111111',
        expirationMonth: 12,
        expirationYear: 2030,
      },
      verificationData: {
        cavv: 'cavv',
        mdStatus: '1',
        xid: 'xid',
        dsTransId: 'dsTransId',
      },
      paymentApiConfig,
      paymentTrackingData,
      amount: 250,
    })

    const body = JSON.parse(options.body)
    expect(body).toEqual({
      operation: 'Sale',
      transactionType: 'ECommerce',
      cardNumber: '4111111111111111',
      expirationMonth: 12,
      expirationYear: 2030,
      currency: 'ISK',
      amount: 25000,
      systemCalling: 'island.is',
      cardVerificationData: {
        cavv: 'cavv',
        mdStatus: '1',
        xid: 'xid',
        dsTransId: 'dsTransId',
      },
      additionalData: { merchantReferenceData: 'rrn-1' },
      correlationId: 'correlation-1',
    })
  })
})
