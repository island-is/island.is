// export default {
//   production: false,
//   IDS_JWKS_URI: 'http://localhost:6000/.well-known/openid-configuration/jwks', // TLS?
//   IDS_AUDIENCE: '@identityserver.api',
//   IDS_ISSUER: 'https://localhost:6001'
// }


export default () => ({
  production: false,
  IDS_JWKS_URI: 'http://localhost:6000/.well-known/openid-configuration/jwks', // TLS?
  IDS_AUDIENCE: '@identityserver.api',
  IDS_ISSUER: 'https://localhost:6001',
  PORTSSS: 3339
})
