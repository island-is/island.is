export const environment = {
  // production: false,
  // auth: {
  //   issuer: 'https://identity-server.dev01.devland.is',
  //   jwksUri:
  //     'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
  // },
  auth: {
    issuer: 'https://localhost:6001',
    jwksUri: 'http://localhost:6002/.well-known/openid-configuration/jwks',
  },
}
