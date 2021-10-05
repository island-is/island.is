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
    fileBaseUrl: 'https://fjarhagsadstod.dev.sveitarfelog.net/files',
    postTimeToLiveMinutes: 5,
    getTimeToLiveMinutes: 5,
  },
  identityServerAuth: {
    issuer: process.env.IDENTITYSERVER_DOMAIN ?? '',
    audience: '@samband.is',
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
}

const devConfig = {
  production: false,
  files: {
    cloudFrontPublicKeyId: process.env.CLOUDFRONT_PUBLIC_KEY_ID ?? '',
    cloudFrontPrivateKey: process.env.CLOUDFRONT_PRIVATE_KEY ?? '',
    fileBaseUrl: 'https://fjarhagsadstod.dev.sveitarfelog.net/files',
    postTimeToLiveMinutes: 5,
    getTimeToLiveMinutes: 5,
  },
  identityServerAuth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@samband.is',
  },
  emailOptions: {
    useTestAccount: (process.env.EMAIL_USE_TEST_ACCOUNT ?? 'true') === 'true',
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
