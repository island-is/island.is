import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration, FasteignirApi } from '../../gen/fetch'
import { AssetsClientConfig } from './assets.config'

export const PropertiesApiProvider: Provider<FasteignirApi> = {
  provide: FasteignirApi,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof AssetsClientConfig>,
  ) =>
    new FasteignirApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-assets',
          ...config.fetch,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, AssetsClientConfig.KEY],
}
