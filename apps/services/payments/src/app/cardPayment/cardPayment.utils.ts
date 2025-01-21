import { sign, verify, Algorithm } from 'jsonwebtoken'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { VerifyCardInput } from './dtos/verifyCard.input'

interface MdPayload {
  c: string // payment transaction correlation id
  pi: string // payment flow id
  a: number // amount
  iat: number
}

interface MdNormalised {
  correlationId: string
  paymentFlowId: string
  amount: number
  issuedAt: number
}

export const generateMd = ({
  correlationId,
  amount,
  paymentsTokenSigningSecret,
  paymentsTokenSigningAlgorithm,
  paymentsTokenSignaturePrefix,
}: {
  correlationId: string
  amount: number
  paymentsTokenSigningSecret: string
  paymentsTokenSigningAlgorithm: string
  paymentsTokenSignaturePrefix: string
}) => {
  const mdPayload = {
    c: correlationId,
    a: amount,
  } as MdPayload

  const mdToken = sign(mdPayload, paymentsTokenSigningSecret, {
    algorithm: paymentsTokenSigningAlgorithm as Algorithm,
  })

  const md = Buffer.from(
    mdToken.replace(paymentsTokenSignaturePrefix, ''),
  ).toString('base64')

  return md
}

interface PaymentApiConfig {
  paymentsApiSecret: string
  paymentsApiHeaderKey: string
  paymentsApiHeaderValue: string
}

export const generateVerificationRequestOptions = ({
  verifyCardInput,
  md,
  paymentApiConfig,
}: {
  verifyCardInput: VerifyCardInput
  md: string
  paymentApiConfig: PaymentApiConfig
}) => {
  const {
    cardNumber,
    expiryMonth,
    expiryYear,
    cvc,
    amount,
    verificationCallbackUrl,
    correlationId,
  } = verifyCardInput
  const { paymentsApiSecret, paymentsApiHeaderKey, paymentsApiHeaderValue } =
    paymentApiConfig

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      cardNumber,
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cvc,
      cardholderDeviceType: 'WWW',
      amount: amount * 100, // Convert to ISK (aurar)
      currency: 'ISK',
      authenticationUrl: verificationCallbackUrl,
      MD: md,
      systemCalling: 'TODO', // TODO
      correlationId,
    }),
  }

  return requestOptions
}

export const generateChargeRequestOptions = ({
  chargeCardInput,
  verificationData,
  paymentApiConfig,
}: {
  chargeCardInput: ChargeCardInput
  verificationData: {
    cavv: string
    mdStatus: string
    xid: string
    dsTransId: string
  }
  paymentApiConfig: PaymentApiConfig
}) => {
  const { cardNumber, expiryMonth, expiryYear, cvc, amount } = chargeCardInput
  const { paymentsApiSecret, paymentsApiHeaderKey, paymentsApiHeaderValue } =
    paymentApiConfig

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      operation: 'Sale',
      transactionType: 'ECommerce',
      cardNumber,
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cvc,
      currency: 'ISK',
      amount: amount * 100, // Convert to ISK (aurar)
      systemCalling: 'TODO',
      cardVerificationData: verificationData,
    }),
  }

  return requestOptions
}

export const getPayloadFromMd = ({
  md,
  paymentsTokenSignaturePrefix,
  paymentsTokenSigningSecret,
}: {
  md: string
  paymentsTokenSignaturePrefix: string
  paymentsTokenSigningSecret: string
}): MdNormalised => {
  const jwtMd = `${paymentsTokenSignaturePrefix}${Buffer.from(
    md,
    'base64',
  ).toString('utf-8')}`

  const payload = verify(jwtMd, paymentsTokenSigningSecret) as MdPayload

  if (!payload) {
    throw new Error('Invalid MD')
  }

  if (!payload.c) {
    throw new Error('Correlation ID not found in MD')
  }

  if (!payload.pi) {
    throw new Error('Payment flow ID not found in MD')
  }

  if (!payload.iat) {
    throw new Error('Issued at not found in MD')
  }

  if (typeof payload.a === 'undefined') {
    throw new Error('Amount not found in MD')
  }

  return {
    correlationId: payload.c,
    paymentFlowId: payload.pi,
    amount: payload.a,
    issuedAt: payload.iat,
  }
}
