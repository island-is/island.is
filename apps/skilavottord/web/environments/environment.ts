const devConfig = {
  production: false,
  identityProvider: {
    domain: 'https://identity-server.staging01.devland.is',
    clientSecret: process.env.IDENTITY_SERVER_CLIENT_SECRET,
    logoutRedirectUrl: '/',
  },
}

const prodConfig = {
  production: true,
  identityProvider: {
    domain: process.env.IDENTITY_SERVER_DOMAIN,
    clientSecret: process.env.IDENTITY_SERVER_CLIENT_SECRET,
    logoutRedirectUrl: 'https://island.is/skilavottord',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
