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

interface GetEnvUrlOpts {
  urls: string | string[]
  serialize?: boolean
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
    dev: 'https://identity-server.dev01.devland.is',
    staging: 'https://identity-server.staging01.devland.is',
    prod: 'https://innskra.island.is',
  },
} as const

const getEnvUrl = (opts: GetEnvUrlOpts) => {
  const { urls, serialize = false } = opts

  return ref((ctx: Context): string => {
    const processUrls = (url: string) =>
      `${
        ctx.featureDeploymentName ? `${ctx.featureDeploymentName}-` : ''
      }${url}`

    const processedUrls = Array.isArray(urls)
      ? urls.map(processUrls)
      : processUrls(urls)

    return serialize
      ? json(processedUrls)
      : Array.isArray(processedUrls)
      ? processedUrls[0]
      : processedUrls
  })
}

const islandisUrls = {
  local: getEnvUrl({ urls: envUrl.islandis.local }),
  dev: getEnvUrl({ urls: envUrl.islandis.dev }),
  staging: getEnvUrl({ urls: envUrl.islandis.staging }),
  prod: getEnvUrl({ urls: envUrl.islandis.prod }),
}

const idsUrls = {
  local: getEnvUrl({ urls: envUrl.ids.local }),
  dev: getEnvUrl({ urls: envUrl.ids.dev }),
  staging: getEnvUrl({ urls: envUrl.ids.staging }),
  prod: getEnvUrl({ urls: envUrl.ids.prod }),
}

export const createPortalEnv = (
  key: PortalKeys,
  services: BffInfraServices,
) => {
  return {
    // Identity server
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
      local: getEnvUrl({
        urls: [envUrl.islandis.local],
        serialize: true,
      }),
      dev: getEnvUrl({
        urls: [envUrl.islandis.dev],
        serialize: true,
      }),
      staging: getEnvUrl({
        urls: [envUrl.islandis.staging],
        serialize: true,
      }),
      prod: getEnvUrl({
        urls: [envUrl.islandis.prod],
        serialize: true,
      }),
    },
    BFF_CLIENT_BASE_URL: islandisUrls,
    BFF_LOGOUT_REDIRECT_URI: islandisUrls,
    BFF_CALLBACKS_BASE_PATH: {
      local: getEnvUrl({
        urls: `${envUrl.islandis.local}/${key}/bff/callbacks`,
      }),
      dev: getEnvUrl({ urls: `${envUrl.islandis.dev}/${key}/bff/callbacks` }),
      staging: getEnvUrl({
        urls: `${envUrl.islandis.staging}/${key}/bff/callbacks`,
      }),
      prod: getEnvUrl({ urls: `${envUrl.islandis.prod}/${key}/bff/callbacks` }),
    },
    BFF_PROXY_API_ENDPOINT: ref((h) => `http://${h.svc(services.api)}`),
    BFF_ALLOWED_EXTERNAL_API_URLS: {
      local: json(['http://localhost:3377/download/v1']),
      dev: json(['https://api.dev01.devland.is']),
      staging: json(['https://api.staging01.devland.is']),
      prod: json(['https://api.island.is']),
    },
    BFF_CACHE_USER_PROFILE_TTL_MS: (
      ONE_HOUR_IN_MS - FIVE_SECONDS_IN_MS
    ).toString(),
    BFF_LOGIN_ATTEMPT_TTL_MS: ONE_WEEK_IN_MS.toString(),
  }
}
