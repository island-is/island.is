import { Provider } from '@nestjs/common'
import { Configuration, VinnuvelaApi } from '../..'
import { LazyDuringDevScope } from '@island.is/nest/config'
import { ApiConfig } from '../api.config'
import { MachineLicenseService } from '../services/machineLicense.service'

export const MachineLicenseServiceProvider: Provider<MachineLicenseService> = {
  provide: MachineLicenseService,
  scope: LazyDuringDevScope,
  useFactory: (configuration: Configuration) => {
    const api = new VinnuvelaApi(configuration)
    return new MachineLicenseService(api)
  },
  inject: [ApiConfig.provide],
}
