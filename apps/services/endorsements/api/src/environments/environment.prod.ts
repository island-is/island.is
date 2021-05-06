export const environment = {
  metadataProviser: {
    nationalRegistry: {
      baseSoapUrl: process.env.SOFFIA_SOAP_URL,
      user: process.env.SOFFIA_USER,
      password: process.env.SOFFIA_PASS,
      host: process.env.SOFFIA_HOST_URL,
    },
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  swagger: {
    authUrl: '',
    tokenUrl: '',
  },
  apiMock: false,
  audit: {
    groupName: process.env.AUDIT_GROUP_NAME, // used in cloudwatch
    serviceName: 'services-endorsements-api', // used in cloudwatch
    defaultNamespace: '@island.is/services-endorsements-api',
  },
}
