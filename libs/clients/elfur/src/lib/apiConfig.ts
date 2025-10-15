import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { Configuration, OrganizationEmployeeApi } from '../../gen/fetch'
import { ElfurClientConfig } from './elfur.config'

export const ApiConfigFactory = (scopes: Array<string>) => ({
  provide: 'ElfurClientProviderConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
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
              issuer: 'https://identity-server.staging01.devland.is',
              tokenEndpoint:
                'https://identity-server.staging01.devland.is/connect/token',
              clientId: config.clientId,
              clientSecret: config.clientSecret,
              scope: scopes,
            }
          : undefined,
      }),
      basePath: config.basePath,
      headers: {
        'X-Executeasusername': config.apiUsernameKey,
        Accept: 'application/json',
      },
    }),
  inject: [ElfurClientConfig.KEY, IdsClientConfig.KEY],
})
