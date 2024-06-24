import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { MMSClientConfig } from './mms.config'
import { Provider } from '@nestjs/common'
import { MMSApi } from './mms.api'

export const MMSApiProvider: Provider<MMSApi> = {
  provide: MMSApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof MMSClientConfig>,
  ) => {
    return new MMSApi({
      baseUrl: xroadConfig.xRoadBasePath,
      clientId: xroadConfig.xRoadClient,
      services: {
        license: config.xroadServicePathLicense,
        grade: config.xroadServicePathGrade,
      },
    })
  },
  inject: [XRoadConfig.KEY, MMSClientConfig.KEY],
}
