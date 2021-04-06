export default {
  production: false,
  auth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@island.is',
    jwksUri:
      'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  },
  allowedNationalIds: '1122334455,2233445566',
}
