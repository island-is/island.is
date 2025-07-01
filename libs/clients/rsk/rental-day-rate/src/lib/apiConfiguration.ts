import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { RskRentalDayRateClientConfig } from './RskRentalDayRateClientConfig'

export const RskRentalDayRateConfigurationProvider = {
  provide: Configuration,
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof RskRentalDayRateClientConfig>,
    xRoadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rental-day-rate',
        organizationSlug: 'skatturinn',
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    })
  },
  inject: [
    RskRentalDayRateClientConfig.KEY,
    XRoadConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
