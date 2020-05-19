export const environment = {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=gjafakort.test',
    audience: 'localhost:4200',
    jwtSecret: 'supersecret',
    jwtExpiresInSeconds: 1800,
  },
}
