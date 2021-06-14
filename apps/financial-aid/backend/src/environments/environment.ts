if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.SECRET_TOKEN) {
    throw new Error('Missing SECRET_TOKEN environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    secretToken: process.env.SECRET_TOKEN,
  },
}

const devConfig = {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
