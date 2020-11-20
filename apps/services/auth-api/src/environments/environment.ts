export default {
  production: false,
  auth: {
    issuer: 'https://localhost:6001',
    jwksUri: 'http://localhost:6002/.well-known/openid-configuration/jwks',
  },
}
