import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { DrivingLicenseApi } from '..'
import { ApiV1, ConfigV1 } from '../v1'
import { ApiV2, ConfigV2 } from '../v2'
import { DrivingLicenseApiConfig } from './DrivingLicenseApi.config'

const configFactory = (
  config: ConfigType<typeof DrivingLicenseApiConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-driving-license',
    // ...config.fetchOptions,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const DrivingLicenseApiProvider = {
  provide: DrivingLicenseApi,
  useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
    const configV1 = new ConfigV1(
      configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV1}`),
    )
    const configV2 = new ConfigV2(
      configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV2}`),
    )
    const v1 = new ApiV1(configV1)
    const v2 = new ApiV2(configV2)
    return new DrivingLicenseApi(v1, v2)
  },
  inject: [DrivingLicenseApiConfig.KEY],
}
