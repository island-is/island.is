import { DynamicModule } from '@nestjs/common'
import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from '@island.is/clients/middlewares'
import { DrivingLicenseApi } from './drivingLicenseApi.service'
import { ApiV1, ConfigV1 } from '../v1'
import { ApiV2, ConfigV2 } from '../v2'

export interface DrivingLicenseApiConfig {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
  xroadPathV1: string
  xroadPathV2: string
  fetchOptions?: Partial<EnhancedFetchOptions>
}

const configFactory = (config: DrivingLicenseApiConfig, basePath: string) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-driving-license',
    ...config.fetchOptions,
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export class DrivingLicenseApiModule {
  static register(config: DrivingLicenseApiConfig): DynamicModule {
    return {
      module: DrivingLicenseApiModule,
      providers: [
        {
          provide: DrivingLicenseApi,
          useFactory: () => {
            const apiV1 = new ApiV1(
              new ConfigV1(
                configFactory(
                  config,
                  `${config.xroadBaseUrl}/${config.xroadPathV1}`,
                ),
              ),
            )
            const apiV2 = new ApiV2(
              new ConfigV2(
                configFactory(
                  config,
                  `${config.xroadBaseUrl}/${config.xroadPathV2}`,
                ),
              ),
            )

            return new DrivingLicenseApi(apiV1, apiV2)
          },
        },
      ],
      exports: [DrivingLicenseApi],
    }
  }
}
