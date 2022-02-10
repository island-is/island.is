import { Provider } from '@nestjs/common'
import { SkipApi } from './gen/fetch'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './FishingLicenseClientConfig'
import { FishingLicenseApiFactoryConfig } from './FishingLicenseApiFactoryConfig'

export const SkipApiProvider: Provider<SkipApi> = {
  provide: SkipApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
    idsConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new SkipApi(FishingLicenseApiFactoryConfig(xRoadConfig, config, idsConfig)),

  inject: [XRoadConfig.KEY, FishingLicenseClientConfig.KEY],
}
