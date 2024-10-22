import { json, ref } from './dsl'
import {
  EnvironmentVariables,
  BffInfraServices,
  Secrets,
} from './types/input-types'

export type PortalKeys = 'stjornbord' | 'minarsidur'

export interface BffConfig {
  key: PortalKeys
  clientName: string
  services: BffInfraServices
  env: EnvironmentVariables
}

export class BffConf {
  constructor(private config: BffConfig) {}

  getEnv(): EnvironmentVariables {
    const { key, services, env } = this.config
    console.debug(JSON.stringify(services, null, 2))
    return {
      ...env,
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
      BFF_ALLOWED_REDIRECT_URIS: ref((ctx) => {
        const baseUrl = ctx.featureDeploymentName
          ? `${ctx.featureDeploymentName}-${ctx.env.domain}`
          : `beta.${ctx.env.domain}`
        return json([`https://${baseUrl}`])
      }),
      // BFF_CLIENT_BASE_URL: ref((ctx) => ctx.svc(services.api)),
      BFF_CLIENT_BASE_URL: ref((ctx) => {
        const baseUrl = ctx.featureDeploymentName
          ? `${ctx.featureDeploymentName}-${ctx.env.domain}`
          : `beta.${ctx.env.domain}`
        return `https://${baseUrl}`
      }),
      BFF_LOGOUT_REDIRECT_URI: ref((ctx) => {
        const baseUrl = ctx.featureDeploymentName
          ? `${ctx.featureDeploymentName}-${ctx.env.domain}`
          : `beta.${ctx.env.domain}`
        return `https://${baseUrl}`
      }),

      BFF_CALLBACKS_BASE_PATH: ref((ctx) => {
        const baseUrl = ctx.featureDeploymentName
          ? `${ctx.featureDeploymentName}-${ctx.env.domain}`
          : `beta.${ctx.env.domain}`
        return `https://${baseUrl}/${key}/bff/callbacks`
      }),
      // BFF_CALLBACKS_BASE_PATH: ref((ctx) => {
      //   const baseUrl = ctx.svc(services.api)
      //   return `${baseUrl}/${key}/bff/callbacks`
      // }),
      BFF_PROXY_API_ENDPOINT: ref((ctx) => `http://${ctx.svc(services.api)}`),
      BFF_ALLOWED_EXTERNAL_API_URLS: {
        local: json(['http://localhost:3377/download/v1']),
        dev: json(['https://api.dev01.devland.is']),
        staging: json(['https://api.staging01.devland.is']),
        prod: json(['https://api.island.is']),
      },
      BFF_CACHE_USER_PROFILE_TTL_MS: (60 * 60 * 1000 - 5000).toString(),
      BFF_LOGIN_ATTEMPT_TTL_MS: (60 * 60 * 1000 * 24 * 7).toString(),
    }
  }

  getSecrets(): Secrets {
    const { clientName } = this.config
    return {
      BFF_TOKEN_SECRET_BASE64: `/k8s/services-bff/${clientName}/BFF_TOKEN_SECRET_BASE64`,
      IDENTITY_SERVER_CLIENT_SECRET: `/k8s/services-bff/${clientName}/IDENTITY_SERVER_CLIENT_SECRET`,
    }
  }
}
