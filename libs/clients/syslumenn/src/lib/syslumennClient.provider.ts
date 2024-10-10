import { Provider } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration, SyslumennApi } from '../../gen/fetch'
import { SyslumennClientConfig } from './syslumennClient.config'

export const SyslumennApiProvider: Provider<SyslumennApi> = {
  provide: SyslumennApi,
  useFactory: (
    config: ConfigType<typeof SyslumennClientConfig>,
    xRoadConfig?: ConfigType<typeof XRoadConfig>,
  ) => {
    if (config.xRoadServicePath && !xRoadConfig) {
      throw new Error(
        'Misconfiguration in SyslumennClient. xRoadServicePath provided without xRoadConfig.',
      )
    }

    return new SyslumennApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-syslumenn',
          organizationSlug: 'syslumenn',
          ...config.fetch,
        }),
        basePath:
          xRoadConfig && config.xRoadServicePath
            ? `${xRoadConfig.xRoadBasePath}/${config.xRoadServicePath}`
            : config.url,
        headers: {
          ...(xRoadConfig &&
            config.xRoadServicePath && {
              'X-Road-Client': xRoadConfig.xRoadClient,
            }),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    )
  },
  inject: [
    SyslumennClientConfig.KEY,
    { token: XRoadConfig.KEY, optional: true },
  ],
}
