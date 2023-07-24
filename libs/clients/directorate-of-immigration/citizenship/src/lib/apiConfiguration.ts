import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { CitizenshipClientConfig } from './citizenshipClient.config'

export const ApiConfiguration = {
  provide: 'CitizenshipClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof CitizenshipClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-directorate-of-immigration-citizenship',
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
  inject: [CitizenshipClientConfig.KEY, IdsClientConfig.KEY],
}
