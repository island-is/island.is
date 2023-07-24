import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { ResidencePermitClientConfig } from './residencePermitClient.config'

export const ApiConfiguration = {
  provide: 'ResidencePermitClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof ResidencePermitClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-directorate-of-immigration-residence-permit',
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
  inject: [ResidencePermitClientConfig.KEY, IdsClientConfig.KEY],
}
