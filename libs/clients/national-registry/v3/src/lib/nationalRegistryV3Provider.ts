import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'

import { Configuration, EinstaklingarApi } from '../../gen/fetch'
import { NationalRegistryV3ClientConfig } from './nationalRegistryV3.config'

export const NationalRegistryV3ApiProvider: Provider<EinstaklingarApi> = {
  provide: EinstaklingarApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof NationalRegistryV3ClientConfig>,
  ) =>
    new EinstaklingarApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-national-registry-v3',
          timeout: config.fetchTimeout,
          autoAuth: {
            mode: 'token',
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            scope: [config.scope],
            issuer: '',
            tokenEndpoint: config.endpoint,
          },
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
        headers: {
          'X-Road-Client': xroadConfig.xRoadClient,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [XRoadConfig.KEY, NationalRegistryV3ClientConfig.KEY],
}
