import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { ElfurClientConfig } from './elfur.config'

export const apiConfigFactory = (
  scopes: Array<string>,
  config: ConfigType<typeof ElfurClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
) =>
  new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'clients-elfur',
      organizationSlug: 'fjarsysla-rikisins',
      autoAuth: idsClientConfig.isConfigured
        ? {
            mode: 'token',
            issuer: config.authUrl,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            scope: scopes,
          }
        : undefined,
    }),
    basePath: config.basePath,
    headers: {
      Accept: 'application/json',
    },
  })
