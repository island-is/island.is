import { SyslumennApi, Configuration } from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { SyslumennClientConfig } from './syslumennClient.config'

export const ApiConfiguration = {
  provide: SyslumennApi,
  useFactory: (config: ConfigType<typeof SyslumennClientConfig>) => {
    return new SyslumennApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-syslumenn',
          ...config.fetch,
        }),
        basePath: config.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )
  },
  inject: [SyslumennClientConfig.KEY],
}
