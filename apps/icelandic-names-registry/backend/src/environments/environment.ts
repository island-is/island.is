const devConfig = {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}

const prodConfig = {
  production: true,
  auth: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL ?? '',
    audience: '',
  },
  allowedNationalIds: process.env.ALLOWED_NATIONAL_IDS ?? '',
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
