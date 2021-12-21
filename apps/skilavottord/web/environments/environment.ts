const devConfig = {
  production: false,
  identityProvider: {
    domain: 'identity-server.staging01.devland.is',
    clientSecret: process.env.IDENTITY_SERVER_CLIENT_SECRET,
    logoutRedirectUrl: '/',
    nextAuth: process.env.NEXTAUTH_URL,
  },
}

const prodConfig = {
  production: true,
  identityProvider: {
    domain: process.env.IDENTITY_SERVER_DOMAIN,
    clientSecret: process.env.IDENTITY_SERVER_CLIENT_SECRET,
    logoutRedirectUrl: 'https://island.is/skilavottord',
    nextAuth: process.env.NEXTAUTH_URL,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
