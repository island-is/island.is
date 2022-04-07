import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { DrivingLicenseApi, Configuration } from '../../gen/fetch'

import { DrivingLicenseClientConfig } from './DrivingLicenseClient.config'

export const DrivingLicenseApiProvider = {
  provide: DrivingLicenseApi,
  useFactory: (config: ConfigType<typeof DrivingLicenseClientConfig>) => {
    return new DrivingLicenseApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-user-profile',
        }),
        basePath: config.basePath,
      }),
    )
  },
  inject: [DrivingLicenseClientConfig.KEY],
}
