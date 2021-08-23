if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }

  if (!process.env.SECRET_TOKEN) {
    throw new Error('Missing SECRET_TOKEN environment.')
  }

  if (!process.env.CLOUDFRONT_PUBLIC_KEY_ID) {
    throw new Error('Missing CLOUDFRONT_PUBLIC_KEY_ID environment.')
  }

  if (!process.env.CLOUDFRONT_PRIVATE_KEY) {
    throw new Error('Missing CLOUDFRONT_PUBLIC_KEY_ID environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
  files: {
    cloudFrontPublicKeyId: process.env.CLOUDFRONT_PUBLIC_KEY_ID,
    cloudFrontPrivateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    fileBaseUrl: 'https://fjarhagsadstod.dev.sveitarfelog.net/files',
    postTimeToLiveMinutes: 5,
    getTimeToLiveMinutes: 5,
  },
}

const devConfig = {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  files: {
    cloudFrontPublicKeyId: process.env.CLOUDFRONT_PUBLIC_KEY_ID ?? '',
    cloudFrontPrivateKey: process.env.CLOUDFRONT_PRIVATE_KEY ?? '',
    fileBaseUrl: 'https://fjarhagsadstod.dev.sveitarfelog.net/files',
    postTimeToLiveMinutes: 5,
    getTimeToLiveMinutes: 5,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
