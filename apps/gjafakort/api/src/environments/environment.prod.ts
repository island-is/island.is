export const environment = {
  production: true,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=ferdagjof.prod',
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtExpiresInSeconds: process.env.AUTH_JWT_EXPIRES_IN_SECONDS,
  },
}
