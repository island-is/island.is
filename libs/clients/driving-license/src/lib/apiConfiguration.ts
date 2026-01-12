import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@nestjs/config'
import { ApiV1, ConfigV1 } from '../v1'
import { ApiV2, ConfigV2 } from '../v2'
import { ApiV4, ConfigV4 } from '../v4'
import { DrivingLicenseApiConfig } from './drivingLicenseApi.config'
import {
  ApiV5,
  ApplicationApiV5,
  CodeTableV5,
  ConfigV5,
  ImageApiV5,
} from '../v5'

const configFactory = (
  config: ConfigType<typeof DrivingLicenseApiConfig>,
  basePath: string,
) => ({
  fetchApi: createEnhancedFetch({
    name: 'clients-driving-license',
    organizationSlug: 'rikislogreglustjori',
  }),
  headers: {
    'X-Road-Client': config.xroadClientId,
    SECRET: config.secret,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  basePath,
})

export const exportedApis = [
  {
    provide: ApiV1,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApiV1(
        new ConfigV1(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV1}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ApiV2,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApiV2(
        new ConfigV2(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV2}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ApiV4,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApiV4(
        new ConfigV4(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV4}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ApiV5,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApiV5(
        new ConfigV5(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV5}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ApplicationApiV5,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApplicationApiV5(
        new ConfigV5(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV5}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: CodeTableV5,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new CodeTableV5(
        new ConfigV5(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV5}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ImageApiV5,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ImageApiV5(
        new ConfigV5(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV5}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
]
