import { Provider } from '@nestjs/common'
import { UtgerdirApi } from '../../gen/fetch'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './fishing-license.config'
import { FishingLicenseApiFactoryConfig } from './fishing-license-api-factory.config'

export const UtgerdirApiProvider: Provider<UtgerdirApi> = {
  provide: UtgerdirApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
  ) =>
    new UtgerdirApi(
      FishingLicenseApiFactoryConfig(
        config.xRoadServicePath,
        xRoadConfig.xRoadBasePath,
        xRoadConfig.xRoadClient,
      ),
    ),

  inject: [XRoadConfig.KEY, FishingLicenseClientConfig.KEY],
}
