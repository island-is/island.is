if (process.env.NODE_ENV === 'production') {
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN
      ? `https://${process.env.IDENTITY_SERVER_DOMAIN}`
      : '',
    audience: '@samband.is',
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
  nationalRegistryXRoad: {
    xRoadBasePathWithEnv: process.env.XROAD_BASE_PATH_WITH_ENV ?? '',
    xRoadTjodskraMemberCode: process.env.XROAD_TJODSKRA_MEMBER_CODE ?? '',
    xRoadTjodskraApiPath: process.env.XROAD_TJODSKRA_API_PATH ?? '',
    xRoadClientId: process.env.XROAD_CLIENT_ID ?? '',
  },
}

const devConfig = {
  production: false,
  identityServerAuth: {
    issuer: 'https://identity-server.dev01.devland.is',
    audience: '@samband.is',
  },
  backend: {
    url: 'http://localhost:3344',
  },
  nationalRegistryXRoad: {
    xRoadBasePathWithEnv: 'http://localhost:5050/r1/IS-DEV',
    xRoadTjodskraMemberCode: '10001',
    xRoadTjodskraApiPath: '/SKRA-Protected/Einstaklingar-v1',
    xRoadClientId: 'IS-DEV/MUN/10023/samband-sveitarfelaga-client',
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
