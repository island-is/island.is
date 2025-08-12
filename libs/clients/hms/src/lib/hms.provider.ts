import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import {
  StadfangApi,
  FasteignApi,
  AdalmatseiningApi,
  Configuration,
} from '../../gen/fetch'
import { HmsConfig } from './hms.config'

const createApiProvider = <T>(
  ApiClass: new (config: Configuration) => T,
): Provider<T> => ({
  provide: ApiClass,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof HmsConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) =>
    new ApiClass(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms',
          organizationSlug: 'hms',
          timeout: config.fetchTimeout,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadPath}`,
        headers: {
          'X-Road-Client': config.xRoadClientHeader,
          Accept: 'application/json',
        },
      }),
    ),
  inject: [HmsConfig.KEY, XRoadConfig.KEY],
})

export const HmsStadfangApiProvider = createApiProvider(StadfangApi)
export const HmsFasteignApiProvider = createApiProvider(FasteignApi)
export const HmsAdalmatseiningApiProvider = createApiProvider(AdalmatseiningApi)
