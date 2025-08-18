import { json, ref } from './dsl'
import { BffInfo, Context, PortalKeys } from './types/input-types'

import {
  adminPortalScopes,
  applicationSystemScopes,
  servicePortalScopes,
  formSystemScopes,
} from '../../../libs/auth/scopes/src/index'

const MINAR_SIDUR: PortalKeys = 'minarsidur'
const STJORNBORD: PortalKeys = 'stjornbord'

/**
 * Trim any leading and trailing slashes
 */
const sanitizePath = (path: string) => path.replace(/^\/+|\/+$/g, '')

export const getScopes = (key: PortalKeys) => {
  switch (key) {
    case MINAR_SIDUR: {
      const combinedScopes = new Set([
        ...servicePortalScopes,
        ...applicationSystemScopes,
        ...formSystemScopes,
      ])

      return [...combinedScopes]
    }

    case STJORNBORD: {
      const uniqueScopes = new Set([...adminPortalScopes])

      return [...uniqueScopes]
    }

    default:
      throw new Error('Invalid BFF client')
  }
}

export const bffConfig = ({
  key,
  services,
  clientName,
  clientId,
  globalPrefix,
}: BffInfo) => {
  const sanitizeGlobalPrefix = sanitizePath(globalPrefix)

  const getBaseUrl = (ctx: Context) => {
    const domain = ctx.featureDeploymentName
      ? `${ctx.featureDeploymentName}-beta.${ctx.env.domain}`
      : ctx.env.type === 'prod'
      ? ctx.env.domain
      : `beta.${ctx.env.domain}`

    return `https://${domain}`
  }

  const getRedirectUris = (baseUrl: string, key: PortalKeys) => [
    `${baseUrl}/${key}`,
    ...(key === MINAR_SIDUR ? [`${baseUrl}/umsoknir`, `${baseUrl}/form`] : []),
  ]

  return {
    env: {
      IDENTITY_SERVER_CLIENT_SCOPES: json(getScopes(key)),
      IDENTITY_SERVER_CLIENT_ID: clientId,
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
      BFF_GLOBAL_PREFIX: globalPrefix,
      BFF_CLIENT_BASE_PATH: `/${key}`,
      BFF_PAR_SUPPORT_ENABLED: 'false',
      BFF_CLIENT_BASE_URL: {
        local: 'http://localhost:4200',
        dev: ref((ctx) => ctx.svc(getBaseUrl(ctx))),
        staging: ref((ctx) => ctx.svc(getBaseUrl(ctx))),
        prod: 'https://island.is',
      },
      BFF_ALLOWED_REDIRECT_URIS: {
        local: json([
          `http://localhost:4200/${key}`,
          // This is a special case for minarsidur, since it serves two applications
          ...(key === MINAR_SIDUR
            ? ['http://localhost:4242/umsoknir', 'http://localhost:4201/form']
            : []),
        ]),
        dev: ref((ctx) => json(getRedirectUris(getBaseUrl(ctx), key))),
        staging: ref((ctx) => json(getRedirectUris(getBaseUrl(ctx), key))),
        prod: json(getRedirectUris('https://island.is', key)),
      },
      BFF_LOGOUT_REDIRECT_URI: {
        local: `http://localhost:4200/${key}`,
        dev: ref(getBaseUrl),
        staging: ref(getBaseUrl),
        prod: 'https://island.is',
      },
      BFF_CALLBACKS_BASE_PATH: {
        local: `http://localhost:3010/${sanitizeGlobalPrefix}/callbacks`,
        dev: ref((c) => `${getBaseUrl(c)}/${sanitizeGlobalPrefix}/callbacks`),
        staging: ref(
          (c) => `${getBaseUrl(c)}/${sanitizeGlobalPrefix}/callbacks`,
        ),
        prod: ref((c) => `${getBaseUrl(c)}/${sanitizeGlobalPrefix}/callbacks`),
      },
      BFF_PROXY_API_ENDPOINT: {
        local: 'http://localhost:4444/api/graphql',
        dev: ref((ctx) => `http://${ctx.svc(services.api)}/api/graphql`),
        staging: ref((ctx) => `http://${ctx.svc(services.api)}/api/graphql`),
        prod: ref((ctx) => `http://${ctx.svc(services.api)}/api/graphql`),
      },
      BFF_CACHE_USER_PROFILE_TTL_MS: (60 * 60 * 1000 - 5000).toString(),
      BFF_LOGIN_ATTEMPT_TTL_MS: (60 * 60 * 1000 * 24 * 7).toString(),
    },
    secrets: {
      BFF_TOKEN_SECRET_BASE64: `/k8s/services-bff/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/services-bff/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
    },
  }
}
