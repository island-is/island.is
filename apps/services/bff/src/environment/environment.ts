import type { BffEnvironmentSchema } from './environment.schema'

export const environment: BffEnvironmentSchema = {
  production: process.env.NODE_ENV === 'production',
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME,
    defaultNamespace: '@island.is/bff',
    serviceName: 'services-bff',
  },
  port: 4444,
  auth: {
    issuer:
      process.env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
    audience: ['@admin.island.is'],
  },
}
