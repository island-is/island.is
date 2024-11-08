const isProduction = process.env.NODE_ENV === 'production'

export default {
  audit: {
    defaultNamespace: '@island.is/payments',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: isProduction ? 'services-payments' : undefined,
  },
  port: process.env.PORT ?? 3333,
}
