import { Provider } from '@nestjs/common'
import { UmsoknirApi } from '../../gen/fetch'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './FishingLicenseClientConfig'
import { FishingLicenseApiFactoryConfig } from './FishingLicenseApiFactoryConfig'

export const UmsoknirApiProvider: Provider<UmsoknirApi> = {
  provide: UmsoknirApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
    idsConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new UmsoknirApi(
      FishingLicenseApiFactoryConfig(xRoadConfig, config, idsConfig),
    ),

  inject: [XRoadConfig.KEY, FishingLicenseClientConfig.KEY],
}
