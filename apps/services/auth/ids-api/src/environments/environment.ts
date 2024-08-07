const devConfig = {
  production: false,
  auth: {
    audience: '@identityserver.api',
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? 'https://localhost:5001',
  },
  audit: {
    defaultNamespace: '@island.is/auth-api',
  },
  port: 4333,
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.IDENTITY_SERVER_ISSUER_URL) {
    throw new Error('Missing IDENTITY_SERVER_ISSUER_URL environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    audience: '@identityserver.api',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
  audit: {
    defaultNamespace: '@island.is/auth-api',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-auth-api',
  },
  port: 3333,
}

export default process.env.PROD_MODE === 'true' ||
process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig
