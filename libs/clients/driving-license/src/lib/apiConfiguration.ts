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
import {
  ApiV6,
  ApplicationApiV6,
  CodeTableV6,
  ConfigV6,
  ImageApiV6,
  LicenseOrderingApiV6,
  LicenseServiceApiV6,
  RLSApplicationProxyApiV6,
  StatisticsApiV6,
} from '../v6'

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
  {
    provide: ApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ApplicationApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ApplicationApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: CodeTableV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new CodeTableV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: ImageApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new ImageApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: LicenseOrderingApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new LicenseOrderingApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: LicenseServiceApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new LicenseServiceApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: RLSApplicationProxyApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new RLSApplicationProxyApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
  {
    provide: StatisticsApiV6,
    useFactory: (config: ConfigType<typeof DrivingLicenseApiConfig>) => {
      return new StatisticsApiV6(
        new ConfigV6(
          configFactory(config, `${config.xroadBaseUrl}/${config.xroadPathV6}`),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
]
