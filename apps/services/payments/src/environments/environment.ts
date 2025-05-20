const isProduction = process.env.NODE_ENV === 'production'

const decodeBase64Key = (base64Key: string | undefined): string | undefined => {
  if (!base64Key) return undefined
  return Buffer.from(base64Key, 'base64').toString('utf-8')
}

const environment = {
  audit: {
    defaultNamespace: '@island.is/payments',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: isProduction ? 'services-payments' : undefined,
  },
  paymentsWeb: {
    origin: process.env.PAYMENTS_WEB_URL,
  },
  chargeFjs: {
    systemId: 'ISL',
    returnUrl: process.env.INVOICE_RETURN_URL,
  },
  jwtSigning: {
    issuer: process.env.PAYMENTS_JWT_SIGNING_ISSUER!,
    keyId: process.env.PAYMENTS_JWT_SIGNING_KEY_ID!,
    privateKey: decodeBase64Key(process.env.PAYMENTS_JWT_SIGNING_PRIVATE_KEY)!,
    publicKey: decodeBase64Key(process.env.PAYMENTS_JWT_SIGNING_PUBLIC_KEY)!,
    expiresInMinutes: process.env.PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES
      ? Number(process.env.PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES)
      : 5,
    previousPublicKeyId: process.env.PAYMENTS_PREVIOUS_KEY_ID,
    previousPublicKey: decodeBase64Key(
      process.env.PAYMENTS_PREVIOUS_PUBLIC_KEY,
    ),
  },
  port: process.env.PORT ? Number(process.env.PORT) : 5555,
}

export default environment

export type Environment = typeof environment
