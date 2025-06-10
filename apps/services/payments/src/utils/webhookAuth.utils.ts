import * as jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import * as crypto from 'crypto'

import type { Logger } from '@island.is/logging'

interface JwtSigningConfig {
  privateKey: string
  keyId: string
  issuer: string
  expiresInMinutes: number
}

interface PaymentFlowInfo {
  id: string
  onUpdateUrl: string
}

interface UpdateInfo {
  type: string
}

export const generatePayloadHash = (payload: object) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex')
}

export const generateWebhookJwt = (
  paymentFlow: PaymentFlowInfo,
  updateInfo: UpdateInfo,
  updateBody: object,
  jwtConfig: JwtSigningConfig,
  logger?: Logger,
): string => {
  if (
    !jwtConfig.privateKey ||
    !jwtConfig.keyId ||
    !jwtConfig.issuer ||
    typeof jwtConfig.expiresInMinutes === 'undefined'
  ) {
    throw new Error(
      'JWT signing configuration is incomplete or invalid for webhook notifications.',
    )
  }

  const now = Math.floor(Date.now() / 1000)
  let upstreamSystemIdentifier = 'unknown-audience'
  try {
    upstreamSystemIdentifier = new URL(paymentFlow.onUpdateUrl).origin
  } catch (e) {
    // Log this warning, but proceed with a default audience
    ;(logger ?? console).warn(
      `Could not parse onUpdateUrl to determine audience: ${paymentFlow.onUpdateUrl}. Using default.`,
    )
  }

  const claims = {
    iss: jwtConfig.issuer,
    aud: upstreamSystemIdentifier,
    sub: paymentFlow.id,
    jti: uuid(),
    iat: now,
    exp: now + jwtConfig.expiresInMinutes * 60,
    event_type: updateInfo.type,
    payload_hash: generatePayloadHash(updateBody),
  }

  return jwt.sign(claims, jwtConfig.privateKey, {
    algorithm: 'RS256',
    header: {
      kid: jwtConfig.keyId,
    },
  })
}
