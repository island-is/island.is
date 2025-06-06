const isProduction = process.env.NODE_ENV === 'production'

const decodeBase64Key = (base64Key: string | undefined): string | undefined => {
  if (!base64Key) return undefined
  return Buffer.from(base64Key, 'base64').toString('utf-8')
}

export const environment = {
  audit: {
    defaultNamespace: '@island.is/payments',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: isProduction ? 'services-payments' : undefined,
  },
  chargeFjs: {
    systemId: 'ISL',
    returnUrl: process.env.INVOICE_RETURN_URL,
  },
  port: process.env.PORT ? Number(process.env.PORT) : 5555,
}

export type Environment = typeof environment
