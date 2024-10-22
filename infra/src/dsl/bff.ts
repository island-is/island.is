import { json, ref } from './dsl'
import { BffInfo, PortalKeys, Context } from './types/input-types'
import { Envs } from '../environments'

import {
  adminPortalScopes,
  servicePortalScopes,
} from '../../../libs/auth/scopes/src/index'

export const getScopes = (key: PortalKeys) => {
  switch (key) {
    case 'minarsidur':
      return servicePortalScopes
    case 'stjornbord':
      return adminPortalScopes
    default:
      throw new Error('Invalid BFF client')
  }
}

export const bffConfig = (info: BffInfo) => {
  const { key, services, clientName, env = {} } = info

  const getBaseUrl = (ctx: Context) =>
    ctx.featureDeploymentName
      ? `${ctx.featureDeploymentName}.${ctx.env.domain}`
      : ctx.env.type === 'prod'
      ? ctx.env.domain
      : `beta.${ctx.env.domain}`

  return {
    env: {
      IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes(key)),
      IDENTITY_SERVER_CLIENT_ID: `@admin.island.is/bff-${key}`,
      IDENTITY_SERVER_ISSUER_URL: {
        dev: 'https://identity-server.dev01.devland.is',
        staging: 'https://identity-server.staging01.devland.is',
        prod: 'https://innskra.island.is',
      },
      BFF_NAME: {
        local: key,
        dev: key,
        staging: key,
        prod: key,
      },
      BFF_CLIENT_KEY_PATH: `/${key}`,
      BFF_PAR_SUPPORT_ENABLED: 'false',
      BFF_CLIENT_BASE_URL: {
        dev: ref((h) => h.svc(`https://${getBaseUrl(h)}`)),
        staging: ref((h) => h.svc(`https://${getBaseUrl(h)}`)),
        prod: 'https://island.is',
        local: ref((h) => h.svc('http://localhost:4200')),
      },
      BFF_ALLOWED_REDIRECT_URIS: ref((ctx) =>
        json([`https://${getBaseUrl(ctx)}`]),
      ),
      // BFF_CLIENT_BASE_URL: ref((ctx) => `https://${getBaseUrl(ctx)}`),
      BFF_LOGOUT_REDIRECT_URI: ref((ctx) => `https://${getBaseUrl(ctx)}`),
      BFF_CALLBACKS_BASE_PATH: ref(
        (ctx) => `https://${getBaseUrl(ctx)}/${key}/bff/callbacks`,
      ),
      BFF_PROXY_API_ENDPOINT: ref((ctx) => `http://${ctx.svc(services.api)}`),
      BFF_CACHE_USER_PROFILE_TTL_MS: (60 * 60 * 1000 - 5000).toString(),
      BFF_LOGIN_ATTEMPT_TTL_MS: (60 * 60 * 1000 * 24 * 7).toString(),
    },
    secrets: {
      BFF_TOKEN_SECRET_BASE64: `/k8s/services-bff/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/services-bff/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
    },
  }
}
