import { Provider } from '@nestjs/common'
import { UmsoknirApi } from '../../gen/fetch'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { FishingLicenseClientConfig } from './fishing-license.config'
import { FishingLicenseApiFactoryConfig } from './fishing-license-api-factory.config'

export const UmsoknirApiProvider: Provider<UmsoknirApi> = {
  provide: UmsoknirApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof FishingLicenseClientConfig>,
  ) =>
    new UmsoknirApi(
      FishingLicenseApiFactoryConfig(
        config.xRoadServicePath,
        xRoadConfig.xRoadBasePath,
        xRoadConfig.xRoadClient,
      ),
    ),

  inject: [XRoadConfig.KEY, FishingLicenseClientConfig.KEY],
}
