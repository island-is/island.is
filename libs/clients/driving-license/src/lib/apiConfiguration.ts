import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { getAuthContext } from '@island.is/auth-nest-tools'
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
  // Set for v6 providers whose endpoints identify the caller from a forwarded
  // end-user token. The v6 OpenAPI document declares no `jwttoken` parameter
  // (v5 declares 40), but the service still reads identity from the `jwttoken`
  // HEADER — verified on IS-DEV, where the same token in `Authorization` returns
  // 400 "Invalid JWT Token" while `jwttoken` resolves the caller. The generated
  // v6 client has no `initOverrides`, so the header cannot be set per call and
  // has to be injected here.
  //
  // `authSource: 'context'` additionally makes `withAuth` set `Authorization`
  // from the same token, so requests carry both headers. That combination is
  // dev-verified. If RLS ever rejects it, note that the wrapper below reads
  // `getAuthContext()` directly and does NOT need `authSource: 'context'`:
  // dropping it sends only `jwttoken`. Do not "tidy" the wrapper away.
  forwardUserToken = false,
) => {
  const enhancedFetch = createEnhancedFetch({
    name: forwardUserToken
      ? 'clients-driving-license-v6'
      : 'clients-driving-license',
    organizationSlug: 'rikislogreglustjori',
    ...(forwardUserToken ? { authSource: 'context' as const } : {}),
  })

  const fetchApi: typeof enhancedFetch = forwardUserToken
    ? (input, init) => {
        const auth = getAuthContext()
        if (!auth?.authorization) {
          return enhancedFetch(input, init)
        }
        const headers = new Headers(init?.headers as HeadersInit | undefined)
        headers.set('jwttoken', auth.authorization.replace(/^bearer /i, ''))
        return enhancedFetch(input, { ...init, headers })
      }
    : enhancedFetch

  return {
    fetchApi,
    headers: {
      'X-Road-Client': config.xroadClientId,
      SECRET: config.secret,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    basePath,
  }
}

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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
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
          configFactory(
            config,
            `${config.xroadBaseUrl}/${config.xroadPathV6}`,
            true,
          ),
        ),
      )
    },
    inject: [DrivingLicenseApiConfig.KEY],
  },
]
