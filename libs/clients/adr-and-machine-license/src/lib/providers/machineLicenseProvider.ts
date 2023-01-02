import { Provider } from '@nestjs/common'
import { Configuration, VinnuvelaApi } from '../..'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { ApiConfig } from '../api.config'
import { MachineLicenseService } from '../services/machineLicense.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

export const MachineLicenseServiceProvider: Provider<MachineLicenseService> = {
  provide: MachineLicenseService,
  scope: LazyDuringDevScope,
  useFactory: (configuration: Configuration, logger: Logger) => {
    const api = new VinnuvelaApi(configuration)
    return new MachineLicenseService(logger, api)
  },
  inject: [ApiConfig.provide, LOGGER_PROVIDER],
}
