/* eslint-disable @nx/enforce-module-boundaries */
// FIXME: this file can be removed since the DSL is handling this now
import { json, ref } from '../../../../../infra/src/dsl/dsl'
import {
  adminPortalScopes,
  servicePortalScopes,
} from '../../../../../libs/auth/scopes/src/index'
import { FIVE_SECONDS_IN_MS } from '../../src/app/constants/time'
import { BffInfraServices } from '../../../../../infra/src/dsl/types/input-types'

const ONE_HOUR_IN_MS = 60 * 60 * 1000
const ONE_WEEK_IN_MS = ONE_HOUR_IN_MS * 24 * 7

type PortalKeys = 'stjornbord' | 'minarsidur'

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

export const createPortalEnv = (
  key: PortalKeys,
  services: BffInfraServices,
) => {
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
    BFF_ALLOWED_REDIRECT_URIS: {
      local: json(['http://localhost:4200/stjornbord']),
      dev: json(['https://featbff-beta.dev01.devland.is']),
      staging: json(['https://beta.staging01.devland.is']),
      prod: json(['https://island.is']),
    },
    BFF_CLIENT_BASE_URL: {
      local: 'http://localhost:4200',
      dev: 'https://featbff-beta.dev01.devland.is',
      staging: 'https://beta.staging01.devland.is',
      prod: 'https://island.is',
    },
    BFF_LOGOUT_REDIRECT_URI: {
      local: 'http://localhost:4200/stjornbord',
      dev: 'https://featbff-beta.dev01.devland.is',
      staging: 'https://beta.staging01.devland.is',
      prod: 'https://island.is',
    },
    BFF_CALLBACKS_BASE_PATH: {
      local: `http://localhost:3010/${key}/bff/callbacks`,
      dev: `https://featbff-beta.dev01.devland.is/${key}/bff/callbacks`,
      staging: `https://beta.staging01.devland.is/${key}/bff/callbacks`,
      prod: `https://island.is/${key}/bff/callbacks`,
    },
    BFF_PROXY_API_ENDPOINT: ref((h) => `http://${h.svc(services.api)}`),
    BFF_ALLOWED_EXTERNAL_API_URLS: {
      local: json(['http://localhost:3377/download/v1']),
      dev: json(['https://api.dev01.devland.is']),
      staging: json(['https://api.staging01.devland.is']),
      prod: json(['https://api.island.is']),
    },
    /**
     * The TTL should be aligned with the lifespan of the Ids client refresh token.
     * We also subtract 5 seconds from the TTL to handle latency and clock drift.
     */
    BFF_CACHE_USER_PROFILE_TTL_MS: (
      ONE_HOUR_IN_MS - FIVE_SECONDS_IN_MS
    ).toString(),
    BFF_LOGIN_ATTEMPT_TTL_MS: ONE_WEEK_IN_MS.toString(),
  }
}
