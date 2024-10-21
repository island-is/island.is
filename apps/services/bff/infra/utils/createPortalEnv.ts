/* eslint-disable @nx/enforce-module-boundaries */
import { json, ref } from '../../../../../infra/src/dsl/dsl'
import { Context } from '../../../../../infra/src/dsl/types/input-types'
import {
  adminPortalScopes,
  servicePortalScopes,
} from '../../../../../libs/auth/scopes/src/index'
import { FIVE_SECONDS_IN_MS } from '../../src/app/constants/time'
import { BffInfraServices } from '../admin-portal.infra'

const ONE_HOUR_IN_MS = 60 * 60 * 1000
const ONE_WEEK_IN_MS = ONE_HOUR_IN_MS * 24 * 7

type PortalKeys = 'stjornbord' | 'minarsidur'
type Cluster = 'islandis' | 'ids'
type Environment = 'local' | 'dev' | 'staging' | 'prod'

interface GetEnvUrlOpts {
  cluster: Cluster
  environment: Environment
  urlPath?: string
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

// FIXME: move to DSL
const envUrl = {
  islandis: {
    local: 'http://localhost:4200',
    dev: 'https://beta.dev01.devland.is',
    staging: 'https://beta.staging01.devland.is',
    prod: 'https://island.is',
  },
  ids: {
    local: 'http://localhost:4200',
    dev: 'identity-server.dev01.devland.is',
    staging: 'identity-server.staging01.devland.is',
    prod: 'innskra.island.is',
  },
}

const getEnvUrl = (opts: GetEnvUrlOpts) => {
  const { cluster, environment, urlPath = '' } = opts

  return ref(
    (ctx: Context): string =>
      `${ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''}${
        envUrl[cluster][environment]
      }${urlPath}`,
  )
}
const islandisUrls = {
  local: getEnvUrl({ cluster: 'islandis', environment: 'local' }),
  dev: getEnvUrl({ cluster: 'islandis', environment: 'dev' }),
  staging: getEnvUrl({ cluster: 'islandis', environment: 'staging' }),
  prod: getEnvUrl({ cluster: 'islandis', environment: 'prod' }),
} as const

const idsUrls = {
  local: getEnvUrl({ cluster: 'ids', environment: 'local' }),
  dev: getEnvUrl({ cluster: 'ids', environment: 'dev' }),
  staging: getEnvUrl({ cluster: 'ids', environment: 'staging' }),
  prod: getEnvUrl({ cluster: 'ids', environment: 'prod' }),
} as const

export const createPortalEnv = (
  key: PortalKeys,
  services: BffInfraServices,
) => {
  return {
    // Idenity server
    IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes(key)),
    IDENTITY_SERVER_CLIENT_ID: `@admin.island.is/bff-${key}`,
    IDENTITY_SERVER_ISSUER_URL: idsUrls,
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
      local: json([{ ...islandisUrls.local, urlPath: '/stjornbord' }]),
      dev: json([islandisUrls.dev]),
      staging: json([islandisUrls.staging]),
      prod: json([islandisUrls.prod]),
    },
    BFF_CLIENT_BASE_URL: {
      local: json([islandisUrls.local]),
      dev: json([islandisUrls.dev]),
      staging: json([islandisUrls.staging]),
      prod: json([islandisUrls.prod]),
    },
    BFF_LOGOUT_REDIRECT_URI: {
      local: json([islandisUrls.local]),
      dev: json([islandisUrls.dev]),
      staging: json([islandisUrls.staging]),
      prod: json([islandisUrls.prod]),
    },
    BFF_CALLBACKS_BASE_PATH: {
      local: json([
        { ...islandisUrls.local, urlPath: `/${key}/bff/callbacks` },
      ]),
      dev: json([{ ...islandisUrls.dev, urlPath: `/${key}/bff/callbacks` }]),
      staging: json([
        { ...islandisUrls.dev, urlPath: `/${key}/bff/callbacks` },
      ]),
      prod: json([{ ...islandisUrls.dev, urlPath: `/${key}/bff/callbacks` }]),
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
