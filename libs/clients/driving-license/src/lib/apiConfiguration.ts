import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
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

// DEBUG_TODO_REMOVE: temporary fetch-level request/response logging while
// the 65+ redesign is in deploy-feature testing. Search for `DEBUG_TODO_REMOVE`
// to remove this entire block and the wrapped fetchApi line in configFactory
// before final merge to main.
const withDebugLogging = (fetchApi: EnhancedFetchAPI): EnhancedFetchAPI => {
  return (async (input: any, init?: any) => {
    const method = init?.method ?? 'GET'
    const url =
      typeof input === 'string' ? input : (input as { url?: string }).url ?? '?'
    // eslint-disable-next-line no-console
    console.log(`[DBG dl-fetch req] ${method} ${url}`)
    if (init?.body) {
      // eslint-disable-next-line no-console
      console.log(`[DBG dl-fetch req body] ${method} ${url} ::`, init.body)
    }
    const response = await fetchApi(input as any, init as any)
    try {
      const cloned = (response as unknown as Response).clone()
      cloned
        .text()
        .then((text) => {
          // eslint-disable-next-line no-console
          console.log(
            `[DBG dl-fetch resp ${response.status}] ${method} ${url} ::`,
            text.length > 4000 ? text.slice(0, 4000) + '…(truncated)' : text,
          )
        })
        .catch(() => {
          // ignore — response body not readable
        })
    } catch {
      // ignore — clone/text not available for this response
    }
    return response
  }) as EnhancedFetchAPI
}

const configFactory = (
  config: ConfigType<typeof DrivingLicenseApiConfig>,
  basePath: string,
) => ({
  // DEBUG_TODO_REMOVE: unwrap `withDebugLogging(...)` once verification done
  fetchApi: withDebugLogging(
    createEnhancedFetch({
      name: 'clients-driving-license',
      organizationSlug: 'rikislogreglustjori',
    }),
  ),
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
