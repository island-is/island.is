const isProduction = process.env.NODE_ENV === 'production'

export default {
  audit: {
    defaultNamespace: '@island.is/payments',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: isProduction ? 'services-payments' : undefined,
  },
  islandis: {
    origin: process.env.ISLANDIS_URL || 'http://localhost:4200',
  },
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}
