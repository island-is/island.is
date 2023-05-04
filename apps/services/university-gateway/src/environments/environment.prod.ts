const audience = ['@island.is']

export const environment = {
  production: true,
  port: 3333,
  auth: {
    audience,
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
}
