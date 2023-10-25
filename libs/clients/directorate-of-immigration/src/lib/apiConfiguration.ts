import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { DirectorateOfImmigrationClientConfig } from './directorateOfImmigrationClient.config'

export const ApiConfiguration = {
  provide: 'DirectorateOfImmigrationClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof DirectorateOfImmigrationClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-directorate-of-immigration',
        organizationSlug: 'utlendingastofnun',
        logErrorResponseBody: true,
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'auto',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.scope,
            }
          : undefined,
      }),
      basePath: config.url,
      headers: {
        Accept: 'application/json',
      },
    })
  },
  inject: [DirectorateOfImmigrationClientConfig.KEY, IdsClientConfig.KEY],
}
