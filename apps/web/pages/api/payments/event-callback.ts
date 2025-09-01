import crypto from 'crypto'
import type { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import type { PaymentCallbackPayload } from '@island.is/api/domains/landspitali'
import { logger } from '@island.is/logging'
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
import { JtiCache } from '@island.is/web/utils/redis'

const { serverRuntimeConfig = {} } = getConfig() ?? {}

const issuer = serverRuntimeConfig.paymentsWebUrl
const audience = new URL(
  serverRuntimeConfig.landspitaliPaymentFlowEventCallbackUrl,
).origin
const validationSecret = serverRuntimeConfig.paymentConfirmationSecret

// Redis configuration for JTI storage
const jtiCache = new JtiCache({
  nodes: serverRuntimeConfig.redisUrl ? [serverRuntimeConfig.redisUrl] : [],
  ssl: serverRuntimeConfig.redisUseSsl ?? false,
})

const client = jwksClient({
  jwksUri: `${issuer}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 10 * 60 * 1000, // 10 minutes
})

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

const computeSha256 = (body: string): string => {
  return crypto.createHash('sha256').update(body).digest('hex')
}

const validateIncomingJwt = (token: string, rawBody: string) => {
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

        if (!decoded?.jti) {
          return reject(new Error('Missing jti'))
        }

        jtiCache
          .isReplay(decoded.jti)
          .then((isReplayAttack) => {
            if (isReplayAttack) {
              return reject(new Error('Replay attack detected'))
            }

            const actualHash = computeSha256(rawBody)
            if (!decoded.payload_hash || decoded.payload_hash !== actualHash) {
              return reject(new Error('Payload hash mismatch'))
            }
            resolve(decoded)
          })
          .catch((error) => {
            reject(error)
          })
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
  try {
    await validateIncomingJwt(token, JSON.stringify(req.body))
  } catch (error) {
    logger.warn('Web payment callback JWT validation failed', { error })
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const payment = req.body as PaymentCallbackPayload

  if (payment.type !== 'success') {
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
          validationSecret,
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
          validationSecret,
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
