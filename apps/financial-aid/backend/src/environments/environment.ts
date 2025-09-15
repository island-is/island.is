if (process.env.NODE_ENV === 'production') {
  if (!process.env.CLOUDFRONT_PUBLIC_KEY_ID) {
    throw new Error('Missing CLOUDFRONT_PUBLIC_KEY_ID environment.')
  }

  if (!process.env.CLOUDFRONT_PRIVATE_KEY) {
    throw new Error('Missing CLOUDFRONT_PUBLIC_KEY_ID environment.')
  }
}

const prodConfig = {
  production: true,
  files: {
    cloudFrontPublicKeyId: process.env.CLOUDFRONT_PUBLIC_KEY_ID,
    cloudFrontPrivateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    fileBaseUrl: `${process.env.OSK_BASE_URL}/files`,
    postTimeToLiveMinutes: 5,
    getTimeToLiveMinutes: 5,
  },
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN
      ? `https://${process.env.IDENTITY_SERVER_DOMAIN}`
      : '',
    audience: '@samband.is',
  },
  emailOptions: {
    fromEmail: process.env.SEND_FROM_EMAIL,
    replyToEmail: process.env.SEND_FROM_EMAIL,
  },
  oskBaseUrl: process.env.OSK_BASE_URL,
  applicationSystemBaseUrl: process.env.APPLICATION_SYSTEM_BASE_URL,
  veitaBaseUrl: process.env.VEITA_BASE_URL,
  navEncryptionKey: process.env.NAV_ENCRYPTION_KEY,
  municipalityAccessApiEncryptionKey:
    process.env.MUNICIPALITY_ACCESS_API_ENCRYPTION_KEY,
}

const devConfig = {
  production: false,
  files: {
    cloudFrontPublicKeyId: process.env.CLOUDFRONT_PUBLIC_KEY_ID ?? '',
    cloudFrontPrivateKey: process.env.CLOUDFRONT_PRIVATE_KEY ?? '',
    fileBaseUrl: process.env.OSK_BASE_URL
      ? `${process.env.OSK_BASE_URL}/files`
      : 'https://fjarhagsadstod.dev.sveitarfelog.net/files',
    postTimeToLiveMinutes: 5,
    getTimeToLiveMinutes: 5,
  },
  identityServerAuth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@samband.is',
  },
  emailOptions: {
    fromEmail: process.env.SEND_FROM_EMAIL,
    replyToEmail: process.env.SEND_FROM_EMAIL,
  },
  oskBaseUrl: process.env.OSK_BASE_URL ?? 'http://localhost:4200',
  applicationSystemBaseUrl:
    process.env.APPLICATION_SYSTEM_BASE_URL ??
    'http://localhost:4242/umsoknir/fjarhagsadstod',
  veitaBaseUrl: process.env.VEITA_BASE_URL ?? 'http://localhost:4200',
  navEncryptionKey: process.env.NAV_ENCRYPTION_KEY,
  municipalityAccessApiEncryptionKey:
    process.env.MUNICIPALITY_ACCESS_API_ENCRYPTION_KEY,
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
