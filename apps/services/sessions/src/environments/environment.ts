const isProduction = process.env.NODE_ENV === 'production'

export default {
  audit: {
    defaultNamespace: '@island.is/sessions',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: isProduction ? 'services-sessions' : undefined,
  },
  auth: {
    audience: '@island.is',
    issuer: isProduction
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.IDENTITY_SERVER_ISSUER_URL!
      : process.env.IDENTITY_SERVER_ISSUER_URL ??
        'https://identity-server.dev01.devland.is',
  },
  port: 3333,
}
