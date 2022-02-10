import { Provider } from '@nestjs/common'
import { UtgerdirApi } from './gen/fetch'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './FishingLicenseClientConfig'
import { FishingLicenseApiFactoryConfig } from './FishingLicenseApiFactoryConfig'

export const UtgerdirApiProvider: Provider<UtgerdirApi> = {
  provide: UtgerdirApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
    idsConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new UtgerdirApi(
      FishingLicenseApiFactoryConfig(xRoadConfig, config, idsConfig),
    ),

  inject: [XRoadConfig.KEY, FishingLicenseClientConfig.KEY],
}
