import { isIP } from 'net'
import { sign, verify, Algorithm } from 'jsonwebtoken'
import { z } from 'zod'

import { ChargeCardInput, VerifyCardBrowserInfo, VerifyCardInput } from './dtos'
import {
  MdNormalised,
  MdSerialized,
  SavedVerificationCompleteData,
} from '../../../types/cardPayment'
import { CardPaymentModuleConfigType } from '../cardPayment.config'
import { iskToAur } from '../cardPayment.utils'
import { PaymentTrackingData } from '../../../types'

const MdSerializedSchema = z.object({
  c: z.string().length(36, 'Correlation ID must be 36 characters long'),
  iat: z.number(),
})

/**
 * The payment gateway (EMV 3-D Secure) only accepts these colorDepth values.
 * Browsers can report other values (e.g. 30 on HDR displays); anything else is
 * omitted rather than remapped so we never fabricate device data.
 */
const ACCEPTED_COLOR_DEPTHS = new Set([1, 4, 8, 15, 16, 24, 32, 48])
const BROWSER_LANGUAGE_PATTERN = /^[a-zA-Z0-9-]{1,8}$/
const CARDHOLDER_NAME_MIN_LENGTH = 2
const CARDHOLDER_NAME_MAX_LENGTH = 45
const MAX_SCREEN_DIMENSION = 999999
const MAX_TIME_ZONE_OFFSET = 99999

/**
 * Builds the EMV 3-D Secure `browserData` object of a gateway CardVerification
 * request. Returns undefined when any member the gateway documents as required
 * (ip, screenHeight, screenWidth) is unavailable — a partial object is not
 * sent. Optional members that do not meet the gateway constraints are dropped;
 * browser oddities must never fail the verification itself.
 */
export const buildVerificationBrowserData = (
  browserInfo: VerifyCardBrowserInfo | undefined,
) => {
  if (!browserInfo) {
    return undefined
  }

  const { ipAddress, screenHeight, screenWidth } = browserInfo

  const isValidScreenDimension = (value: number) =>
    Number.isInteger(value) && value >= 0 && value <= MAX_SCREEN_DIMENSION

  if (
    !ipAddress ||
    !isIP(ipAddress) ||
    !isValidScreenDimension(screenHeight) ||
    !isValidScreenDimension(screenWidth)
  ) {
    return undefined
  }

  const {
    colorDepth,
    timeZoneOffset,
    language,
    userAgent,
    acceptHeader,
    javaEnabled,
  } = browserInfo

  return {
    ip: ipAddress,
    screenHeight,
    screenWidth,
    // This data is collected by our script running in the payer's browser.
    javascriptEnabled: true,
    javaEnabled: javaEnabled ?? false,
    ...(colorDepth !== undefined &&
      ACCEPTED_COLOR_DEPTHS.has(colorDepth) && { colorDepth }),
    ...(timeZoneOffset !== undefined &&
      Number.isInteger(timeZoneOffset) &&
      Math.abs(timeZoneOffset) <= MAX_TIME_ZONE_OFFSET && { timeZoneOffset }),
    ...(language !== undefined &&
      BROWSER_LANGUAGE_PATTERN.test(language) && { language }),
    ...(userAgent && { userAgent }),
    ...(acceptHeader && { acceptHeader }),
  }
}

/**
 * Builds the `cardHolderData` object of a gateway CardVerification request.
 * The gateway requires a 2-45 character name; the frontend enforces the same
 * limits, so an out-of-range value means a non-compliant client and the object
 * is omitted (never silently altered) rather than failing the verification.
 */
export const buildVerificationCardholderData = (
  cardholderName: string | undefined,
) => {
  const trimmed = cardholderName?.trim()

  if (
    !trimmed ||
    trimmed.length < CARDHOLDER_NAME_MIN_LENGTH ||
    trimmed.length > CARDHOLDER_NAME_MAX_LENGTH
  ) {
    return undefined
  }

  return { cardholderName: trimmed }
}

export const generateMd = ({
  correlationId,
  paymentsTokenSigningSecret,
  paymentsTokenSigningAlgorithm,
}: {
  correlationId: string
  paymentsTokenSigningSecret: string
  paymentsTokenSigningAlgorithm: string
}) => {
  const mdSerialized: Omit<MdSerialized, 'iat'> = {
    c: correlationId,
  }

  const mdToken = sign(mdSerialized, paymentsTokenSigningSecret, {
    algorithm: paymentsTokenSigningAlgorithm as Algorithm,
  })

  return Buffer.from(mdToken).toString('base64')
}

export const generateVerificationRequestOptions = ({
  verifyCardInput,
  md,
  paymentApiConfig,
  webOrigin,
  amount,
}: {
  verifyCardInput: VerifyCardInput
  md: string
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  webOrigin: string
  amount: number
}) => {
  const { cardNumber, expiryMonth, expiryYear, cardholderName, browserInfo } =
    verifyCardInput
  const {
    paymentsApiSecret,
    paymentsApiHeaderKey,
    paymentsApiHeaderValue,
    systemCalling,
  } = paymentApiConfig

  // The gateway documents browserData and cardHolderData as required members
  // of a CardVerification request (mandatory since gateway release 2.32).
  // Sending them with accurate values gives issuers the EMV 3-D Secure data
  // they need to authenticate the payer. When a client has not supplied the
  // data (e.g. an older frontend during rollout) the request is sent without
  // it, matching the previous behaviour of this integration.
  const browserData = buildVerificationBrowserData(browserInfo)
  const cardHolderData = buildVerificationCardholderData(cardholderName)

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      cardNumber: cardNumber.toString(),
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cardholderDeviceType: 'WWW',
      amount: iskToAur(amount),
      currency: 'ISK',
      authenticationUrl: `${webOrigin}/api/card/callback`,
      MD: md,
      systemCalling,
      ...(browserData && { browserData }),
      ...(cardHolderData && { cardHolderData }),
    }),
  }

  return requestOptions
}

export const generateChargeRequestOptions = ({
  chargeCardInput,
  verificationData,
  paymentApiConfig,
  paymentTrackingData,
  amount,
}: {
  chargeCardInput: ChargeCardInput
  verificationData: SavedVerificationCompleteData
  paymentApiConfig: CardPaymentModuleConfigType['paymentGateway']
  paymentTrackingData: PaymentTrackingData
  amount: number
}) => {
  const { cardNumber, expiryMonth, expiryYear, cvc } = chargeCardInput
  const {
    paymentsApiSecret,
    paymentsApiHeaderKey,
    paymentsApiHeaderValue,
    systemCalling,
  } = paymentApiConfig

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
      cardNumber: cardNumber.toString(),
      expirationMonth: expiryMonth,
      expirationYear: 2000 + expiryYear,
      cvc,
      currency: 'ISK',
      amount: iskToAur(amount),
      systemCalling,
      cardVerificationData: verificationData,
      additionalData: {
        merchantReferenceData: paymentTrackingData.merchantReferenceData,
      },
      correlationId: paymentTrackingData.correlationId,
    }),
  }

  return requestOptions
}

export const getPayloadFromMd = ({
  md,
  paymentsTokenSigningSecret,
}: {
  md: string
  paymentsTokenSigningSecret: string
}): MdNormalised => {
  const jwtMd = Buffer.from(md, 'base64').toString('utf-8')

  const payload = MdSerializedSchema.parse(
    verify(jwtMd, paymentsTokenSigningSecret),
  )

  return {
    correlationId: payload.c,
    issuedAt: payload.iat,
  }
}
