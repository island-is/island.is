import { Provider } from '@nestjs/common'

import {
  ConfigType,
  LazyDuringDevScope,
  XRoadConfig,
} from '@island.is/nest/config'

import { SearchCompanyRegistryApi } from './gen/fetch'
import { CompanyRegistryConfig } from './company-registry.config'
import { CompanyRegistryApiFactoryConfig } from './company-registry-factory.config'

export const SearchCompanyRegistryApiProvider: Provider<SearchCompanyRegistryApi> = {
  provide: SearchCompanyRegistryApi,
  scope: LazyDuringDevScope,
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof CompanyRegistryConfig>,
  ) =>
    new SearchCompanyRegistryApi(
      CompanyRegistryApiFactoryConfig(
        config.xRoadProviderId,
        xRoadConfig.xRoadBasePath,
        xRoadConfig.xRoadClient,
      ),
    ),

  inject: [XRoadConfig.KEY, CompanyRegistryConfig.KEY],
}
