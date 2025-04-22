const isProduction = process.env.NODE_ENV === 'production'

export default {
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
  port: process.env.PORT ? Number(process.env.PORT) : 5555,
}
