const audience = ['@island.is']

export const environment = {
  production: false,
  port: 3379,
  auth: {
    audience,
    issuer: 'https://identity-server.dev01.devland.is',
  },
}
