const devConfig = {
  production: false,
  port: 3369,
  audit: {
    defaultNamespace: '@island.is/documents',
  },
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
  },
}

const prodConfig = {
  production: true,
  port: 3333,
  audit: {
    defaultNamespace: '@island.is/documents',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-documents',
  },
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '@island.is',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
