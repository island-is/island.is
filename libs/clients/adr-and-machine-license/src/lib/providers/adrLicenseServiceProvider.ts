import { Provider } from '@nestjs/common'
import { AdrApi, Configuration } from '../..'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { ApiConfig } from '../api.config'
import { AdrLicenseService } from '../services/adrLicense.service'

export const AdrLicenseServiceProvider: Provider<AdrLicenseService> = {
  provide: AdrLicenseService,
  scope: LazyDuringDevScope,
  useFactory: (configuration: Configuration) => {
    const api = new AdrApi(configuration)
    return new AdrLicenseService(api)
  },
  inject: [ApiConfig.provide],
}
