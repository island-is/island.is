import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Provider } from '@nestjs/common'
import {
  ApplicationApi,
  ApplicationManagerApi,
  Configuration,
} from '../../gen/fetch'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { HmsApplicationSystemConfig } from './hms-application-system.config'

const createApiProvider = <T>(
  ApiClass: new (config: Configuration) => T,
): Provider<T> => ({
  provide: ApiClass,
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof HmsApplicationSystemConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) =>
    new ApiClass(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-hms-application-system',
          organizationSlug: 'hms',
          timeout: config.fetchTimeout,
        }),
        basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadPath}`,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [HmsApplicationSystemConfig.KEY, XRoadConfig.KEY],
})

export const HmsApplicationApiProvider = createApiProvider(ApplicationApi)
export const HmsApplicationManagerApiProvider = createApiProvider(
  ApplicationManagerApi,
)
