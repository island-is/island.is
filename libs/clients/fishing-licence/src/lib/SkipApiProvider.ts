import { Provider } from '@nestjs/common'
import { SkipApi } from '../../gen/fetch'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './fishing-license.config'
import { FishingLicenseApiFactoryConfig } from './fishing-license-api-factory.config'

export const SkipApiProvider: Provider<SkipApi> = {
  provide: SkipApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
  ) => new SkipApi(FishingLicenseApiFactoryConfig(xRoadConfig, config)),

  inject: [XRoadConfig.KEY, FishingLicenseClientConfig.KEY],
}
