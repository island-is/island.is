export default {
  production: false,
  IDS_JWKS_URI: 'http://localhost:6000/.well-known/openid-configuration/jwks',
  IDS_AUDIENCE: '@reference-backend',
  IDS_ISSUER: 'https://localhost:6001',
  OPA_URI: 'http://localhost:8181/v1/data/reference_backend/authz'
}
