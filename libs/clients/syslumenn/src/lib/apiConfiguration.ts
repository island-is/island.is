import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { SyslumennClientConfig } from './syslumennClient.config'

export const ApiConfiguration = {
  provide: 'SyslumennClientApiConfiguration',
  useFactory: (
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SyslumennClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-syslumenn',
        organizationSlug: 'syslumenn',
        ...config.fetch,
      }),
      basePath: config.xRoadServicePath
        ? `${xRoadConfig.xRoadBasePath}/${config.xRoadServicePath}`
        : config.url,
      headers: {
        ...(config.xRoadServicePath && {
          'X-Road-Client': xRoadConfig.xRoadClient,
        }),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }),
  inject: [XRoadConfig.KEY, SyslumennClientConfig.KEY],
}
