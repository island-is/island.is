type PortalKeys = 'stjornbord' | 'minarsidur'

const defaultEnvUrls = {
  dev: 'https://beta.dev01.devland.is',
  staging: 'https://beta.staging01.devland.is',
  prod: 'https://island.is',
}

export const createPortalEnv = (key: PortalKeys) => {
  return {
    // Idenity server
    IDENTITY_SERVER_CLIENT_ID: `@admin.island.is/bff-${key}`,
    IDENTITY_SERVER_ISSUER_URL: {
      dev: 'https://identity-server.dev01.devland.is',
      staging: 'https://identity-server.staging01.devland.is',
      prod: 'https://innskra.island.is',
    },
    // BFF
    BFF_ALLOWED_REDIRECT_URIS: defaultEnvUrls,
    BFF_CLIENT_BASE_URL: defaultEnvUrls,
    BFF_LOGOUT_REDIRECT_URI: defaultEnvUrls,
    BFF_CLIENT_KEY_PATH: `/${key}`,
    BFF_CALLBACKS_BASE_PATH: {
      dev: `https://beta.dev01.devland.is/${key}/bff/callbacks`,
      staging: `https://beta.staging01.devland.is/${key}/bff/callbacks`,
      prod: `https://island.is/${key}/bff/callbacks`,
    },
    BFF_PROXY_API_ENDPOINT: {
      dev: 'https://beta.dev01.devland.is/api/graphql',
      staging: 'https://beta.staging01.devland.is/api/graphql',
      prod: 'https://island.is/api/graphql',
    },
    BFF_ALLOWED_EXTERNAL_API_URLS: {
      dev: 'https://api.dev01.devland.is',
      staging: 'https://api.staging01.devland.is',
      prod: 'https://api.island.is',
    },
  }
}
