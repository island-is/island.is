import crypto from 'crypto'
import type { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import type { PaymentCallbackPayload } from '@island.is/api/domains/landspitali'
import initApollo from '@island.is/web/graphql/client'
import {
  WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutation,
  WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutationVariables,
  WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutation,
  WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutationVariables,
} from '@island.is/web/graphql/schema'
import {
  SEND_LANDSPITALI_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL,
  SEND_LANDSPITALI_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL,
} from '@island.is/web/screens/queries/Landspitali'

const { serverRuntimeConfig = {} } = getConfig() ?? {}

const issuer = serverRuntimeConfig.paymentsWebUrl
const audience = new URL(
  serverRuntimeConfig.landspitaliPaymentFlowEventCallbackUrl,
).origin

const client = jwksClient({
  jwksUri: `${issuer}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 10 * 60 * 1000, // 10 minutes
})

// Get the public key using the 'kid' from the JWT header
const getPublicKeyFromJwtHeader = (
  header: JwtHeader,
  callback: SigningKeyCallback,
) => {
  if (!header.kid) {
    return callback(new Error('Missing kid in JWT header'))
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) return callback(err)
    const signingKey = key?.getPublicKey()
    callback(null, signingKey)
  })
}

// TODO: Find a way to fetch jti from redis and store them there for 5-10 minutes
// Optional: In-memory jti cache (for demo only)
const usedJtis = new Set<string>()
const isReplay = (jti: string): boolean => {
  if (usedJtis.has(jti)) return true
  usedJtis.add(jti)
  return false
}

const computeSha256 = (body: string): string => {
  return crypto.createHash('sha256').update(body).digest('hex')
}

const validateIncomingJwt = (
  token: string,
  rawBody: string,
): Promise<object> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getPublicKeyFromJwtHeader,
      {
        algorithms: ['RS256'],
        issuer,
        audience,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err, decoded: any) => {
        if (err) return reject(err)
        // jti replay check
        if (!decoded.jti || isReplay(decoded.jti)) {
          return reject(new Error('Replay attack detected or missing jti'))
        }
        const actualHash = computeSha256(rawBody)
        if (!decoded.payload_hash || decoded.payload_hash !== actualHash) {
          return reject(new Error('Payload hash mismatch'))
        }
        resolve(decoded)
      },
    )
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const [type, token] = authHeader.split(' ')
  if (type.toLowerCase() !== 'bearer') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // This will throw an error if the JWT is invalid
  await validateIncomingJwt(token, req.body)

  // TODO: Perhaps validate the body
  const payment = req.body as PaymentCallbackPayload

  if (payment.type !== 'success') {
    // TODO: What should I do here?
    // Look into libs/application/api/payment/src/lib/payment-callback.controller.ts
    return res.status(200).send('')
  }

  const apolloClient = initApollo({})

  if (payment.paymentFlowMetadata.landspitaliPaymentType === 'DirectGrant') {
    const response = await apolloClient.mutate<
      WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutation,
      WebLandspitaliSendDirectGrantPaymentConfirmationEmailMutationVariables
    >({
      mutation: SEND_LANDSPITALI_DIRECT_GRANT_PAYMENT_CONFIRMATION_EMAIL,
      variables: {
        input: {
          amountISK: payment.paymentFlowMetadata.amountISK,
          grantChargeItemCode: payment.paymentFlowMetadata.grantChargeItemCode,
          payerAddress: payment.paymentFlowMetadata.payerAddress,
          payerEmail: payment.paymentFlowMetadata.payerEmail,
          payerName: payment.paymentFlowMetadata.payerName,
          payerNationalId: payment.paymentFlowMetadata.payerNationalId,
          payerPostalCode: payment.paymentFlowMetadata.payerPostalCode,
          payerPlace: payment.paymentFlowMetadata.payerPlace,
          payerGrantExplanation:
            payment.paymentFlowMetadata.payerGrantExplanation,
          project: payment.paymentFlowMetadata.project,
        },
      },
    })
    if (
      response.data?.webLandspitaliSendDirectGrantPaymentConfirmationEmail
        ?.success
    ) {
      res.status(200).json({ message: 'Email sent' })
    } else {
      res.status(500).json({ message: 'Failed to send email' })
    }
  } else if (
    payment.paymentFlowMetadata.landspitaliPaymentType === 'MemorialCard'
  ) {
    const response = await apolloClient.mutate<
      WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutation,
      WebLandspitaliSendMemorialCardPaymentConfirmationEmailMutationVariables
    >({
      mutation: SEND_LANDSPITALI_MEMORIAL_CARD_PAYMENT_CONFIRMATION_EMAIL,
      variables: {
        input: {
          amountISK: payment.paymentFlowMetadata.amountISK,
          payerName: payment.paymentFlowMetadata.payerName,
          payerEmail: payment.paymentFlowMetadata.payerEmail,
          payerNationalId: payment.paymentFlowMetadata.payerNationalId,
          payerAddress: payment.paymentFlowMetadata.payerAddress,
          payerPostalCode: payment.paymentFlowMetadata.payerPostalCode,
          payerPlace: payment.paymentFlowMetadata.payerPlace,
          fundChargeItemCode: payment.paymentFlowMetadata.fundChargeItemCode,
          inMemoryOf: payment.paymentFlowMetadata.inMemoryOf,
          recipientAddress: payment.paymentFlowMetadata.recipientAddress,
          recipientName: payment.paymentFlowMetadata.recipientName,
          recipientPlace: payment.paymentFlowMetadata.recipientPlace,
          recipientPostalCode: payment.paymentFlowMetadata.recipientPostalCode,
          senderSignature: payment.paymentFlowMetadata.senderSignature,
        },
      },
    })
    if (
      response.data?.webLandspitaliSendMemorialCardPaymentConfirmationEmail
        ?.success
    ) {
      res.status(200).json({ message: 'Email sent' })
    } else {
      res.status(500).json({ message: 'Failed to send email' })
    }
  }

  return res.status(400).json({ message: 'Unknown payment type' })
}
