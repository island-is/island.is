import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from '../../gen/fetch'
import { SocialInsuranceAdministrationClientConfig } from './socialInsuranceAdministrationClient.config'

export const ApiConfiguration = {
  provide: 'SocialInsuranceAdministrationApiConfig',
  useFactory: (
    xroadConfig: ConfigType<typeof XRoadConfig>,
    config: ConfigType<typeof SocialInsuranceAdministrationClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-tr',
        organizationSlug: 'tryggingastofnun',
        ...config.fetch,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [XRoadConfig.KEY, SocialInsuranceAdministrationClientConfig.KEY],
}
