// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  adminPortalScopes,
  servicePortalScopes,
} from '../../../../../libs/auth/scopes/src/index'
import { json } from '../../../../../infra/src/dsl/dsl'
import { DEFAULT_CACHE_USER_PROFILE_TTL_MS } from '../../src/app/constants/time'

type PortalKeys = 'stjornbord' | 'minarsidur'

const defaultEnvUrls = {
  local: json(['http://localhost:4200/stjornbord']),
  dev: json(['https://beta.dev01.devland.is']),
  staging: json(['https://beta.staging01.devland.is']),
  prod: json(['https://island.is']),
}

const getScopes = (key: PortalKeys) => {
  switch (key) {
    case 'minarsidur':
      return servicePortalScopes

    case 'stjornbord':
      return adminPortalScopes

    default:
      throw new Error('Invalid BFF client')
  }
}

export const createPortalEnv = (key: PortalKeys) => {
  return {
    // Idenity server
    IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes(key)),
    IDENTITY_SERVER_CLIENT_ID: `@admin.island.is/bff-${key}`,
    IDENTITY_SERVER_ISSUER_URL: {
      local: 'https://identity-server.dev01.devland.is',
      dev: 'https://identity-server.dev01.devland.is',
      staging: 'https://identity-server.staging01.devland.is',
      prod: 'https://innskra.island.is',
    },
    // BFF
    BFF_NAME: {
      local: key,
      dev: key,
      staging: key,
      prod: key,
    },
    BFF_CLIENT_KEY_PATH: `/${key}`,
    BFF_PAR_SUPPORT_ENABLED: 'false',
    BFF_ALLOWED_REDIRECT_URIS: defaultEnvUrls,
    BFF_CLIENT_BASE_URL: defaultEnvUrls,
    BFF_LOGOUT_REDIRECT_URI: defaultEnvUrls,
    BFF_CALLBACKS_BASE_PATH: {
      local: `http://localhost:3010/${key}/bff/callbacks`,
      dev: `https://beta.dev01.devland.is/${key}/bff/callbacks`,
      staging: `https://beta.staging01.devland.is/${key}/bff/callbacks`,
      prod: `https://island.is/${key}/bff/callbacks`,
    },
    BFF_PROXY_API_ENDPOINT: {
      local: 'http://localhost:4444/api/graphql',
      dev: 'https://beta.dev01.devland.is/api/graphql',
      staging: 'https://beta.staging01.devland.is/api/graphql',
      prod: 'https://island.is/api/graphql',
    },
    BFF_ALLOWED_EXTERNAL_API_URLS: {
      local: json(['http://localhost:3377/download/v1']),
      dev: json(['https://api.dev01.devland.is']),
      staging: json(['https://api.staging01.devland.is']),
      prod: json(['https://api.island.is']),
    },
    BFF_CACHE_USER_PROFILE_TTL_MS: DEFAULT_CACHE_USER_PROFILE_TTL_MS.toString(),
  }
}
