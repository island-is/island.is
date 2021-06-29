const devConfig = {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
  audit: {
    defaultNamespace: '@island.is/icelandic-names-registry',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}

const prodConfig = {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: '',
  },
  audit: {
    defaultNamespace: '@island.is/icelandic-names-registry',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'icelandic-names-registry-backend',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
