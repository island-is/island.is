export const environment = {
  production: true,
  auth: {
    samlEntryPoint: process.env.AUTH_SAML_ENTRYPOINT,
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtExpiresInSeconds: process.env.AUTH_JWT_EXPIRES_IN_SECONDS,
  },
}
