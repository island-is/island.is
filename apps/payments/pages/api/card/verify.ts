import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { uuid } from 'uuidv4'
import { sign, Algorithm } from 'jsonwebtoken'

import { getTempRedisStorage } from '../../../services/payment'

interface Card {
  number: number
  expiryMonth: number
  expiryYear: number
  cvc: number
}

interface VerificationResponse {
  cardVerificationRawResponse: string
  postUrl: string
  verificationFields: { name: string; value: string }[]
  additionalFields: { name: string; value: string }[]
  isSuccess: true
  cardInformation: {
    cardScheme: string
    issuingCountry: string
    cardUsage: string
    cardCategory: string
    outOfScaScope: string
    cardProductCategory: string
  }
  scriptPath: string
  responseCode: string
  responseDescription: string
  responseTime: string
  correlationId: string
}

const verifyCard = async (
  card: Card,
  amount: number,
  correlationId: string,
): Promise<VerificationResponse> => {
  console.log('verifyCard')

  const {
    serverRuntimeConfig: {
      paymentsTokenSigningSecret,
      paymentsTokenSigningAlgorithm,
      paymentsTokenSignaturePrefix,
      paymentsApiSecret,
      paymentsApiHeaderKey,
      paymentsApiHeaderValue,
      paymentsGatewayApiUrl,
    },
  } = getConfig()

  const mdPayload = {
    c: correlationId,
    amount,
  }

  const mdToken = sign(mdPayload, paymentsTokenSigningSecret, {
    algorithm: paymentsTokenSigningAlgorithm as Algorithm,
  })

  const md = Buffer.from(
    mdToken.replace(paymentsTokenSignaturePrefix, ''),
  ).toString('base64')

  getTempRedisStorage().set(correlationId, { a: amount, md }) // TODO TTL 60 seconds

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: paymentsApiSecret,
      [paymentsApiHeaderKey]: paymentsApiHeaderValue,
    },
    body: JSON.stringify({
      cardNumber: card.number.toString(),
      expirationMonth: card.expiryMonth,
      expirationYear: 2000 + card.expiryYear,
      cardholderDeviceType: 'WWW',
      amount: amount * 100, // Convert to ISK (aurar)
      currency: 'ISK',
      authenticationUrl: `https://beta.dev01.devland.is/`,
      MD: md,
      systemCalling: '**Add your system name here with version number**',
      correlationId,
    }),
  }

  const response = await fetch(
    `${paymentsGatewayApiUrl}/CardVerification`,
    requestOptions,
  )

  if (!response.ok) {
    const responseBody = await response.text()
    console.error('Failed to verify card', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      responseBody,
    })
    throw new Error('Failed to verify card')
  }

  const data = (await response.json()) as VerificationResponse

  return data
}

const badRequest = (res: NextApiResponse, message: string) => {
  return res.status(400).json({ error: message })
}

export default async function verifyCardHandler(
  req: NextApiRequest,
  res: NextApiResponse<VerificationResponse | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { card, amount, correlationId } = req.body

  if (card === undefined) return badRequest(res, 'Card is required')
  if (!card.number) return badRequest(res, 'Card number is required')
  if (!card.expiryMonth) return badRequest(res, 'Card expiry month is required')
  if (!card.expiryYear) return badRequest(res, 'Card expiry year is required')
  if (!card.cvc) return badRequest(res, 'Card cvc is required')

  if (!amount) return badRequest(res, 'Amount is required')
  //   if (!correlationId) return badRequest(res, 'Correlation ID is required')

  try {
    const verifyCardResponse = await verifyCard(card, amount, uuid()) // TODO use id from request
    return res.status(200).json(verifyCardResponse)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
