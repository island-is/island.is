import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { VmstClientConfig } from './vmst.config'
import { Configuration } from '../../gen/fetch'
import { createWrappedFetchWithLogging } from './utils'
import { createXRoadAPIPath } from '@island.is/shared/utils/server'

const isRunningOnProduction = isRunningOnEnvironment('production')

export const ApiConfiguration = {
  provide: 'VmstClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof VmstClientConfig>,
  ) =>
    new Configuration({
      fetchApi: isRunningOnProduction ? fetch : createWrappedFetchWithLogging,
      basePath: createXRoadAPIPath(
        config.xroadBasePathWithEnv,
        config.vmstMemberClass,
        config.vmstMemberCode,
        config.vmstApiPath,
      ),
      headers: {
        'api-key': config.apiKey,
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    }),
  inject: [XRoadConfig.KEY, VmstClientConfig.KEY],
}
