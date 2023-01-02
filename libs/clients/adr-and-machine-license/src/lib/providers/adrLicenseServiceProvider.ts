import { Provider } from '@nestjs/common'
import { AdrApi, Configuration } from '../..'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { ApiConfig } from '../api.config'
import { AdrLicenseService } from '../services/adrLicense.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

export const AdrLicenseServiceProvider: Provider<AdrLicenseService> = {
  provide: AdrLicenseService,
  scope: LazyDuringDevScope,
  useFactory: (configuration: Configuration, logger: Logger) => {
    const api = new AdrApi(configuration)
    return new AdrLicenseService(logger, api)
  },
  inject: [ApiConfig.provide, LOGGER_PROVIDER],
}
