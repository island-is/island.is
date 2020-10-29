export default {
  production: true,
  nationalRegistry: {
    baseSoapUrl: process.env.SOFFIA_SOAP_URL,
    user: process.env.SOFFIA_USER,
    password: process.env.SOFFIA_PASS,
    host: process.env.SOFFIA_HOST_URL,
  },
  userProfile: {
    userProfileServiceBasePath: process.env.SERVICE_USER_PROFILE_URL,
  },
  identityServer: {
    baseUrl: process.env.IDENTITY_SERVER_BASE_URL,
    audience: '',
    jwksUri: `${process.env.IDENTITY_SERVER_BASE_URL}/.well-known/openid-configuration/jwks`,
  },
}
