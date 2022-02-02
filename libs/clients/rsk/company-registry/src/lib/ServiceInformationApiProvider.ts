import { Provider } from '@nestjs/common'
import { ServiceInformationApi } from './gen/fetch'
import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'
import { CompanyRegistryConfig } from './company-registry.config'
import { CompanyRegistryApiFactoryConfig } from './company-registry-factory.config'

export const ServiceInformationApiProvider: Provider<ServiceInformationApi> = {
  provide: ServiceInformationApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof CompanyRegistryConfig>,
  ) =>
    new ServiceInformationApi(
      CompanyRegistryApiFactoryConfig(
        config.xRoadProviderId,
        xRoadConfig.xRoadBasePath,
        xRoadConfig.xRoadClient,
      ),
    ),

  inject: [XRoadConfig.KEY, CompanyRegistryConfig.KEY],
}
