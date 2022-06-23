import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { ChargeFjsV2ClientConfig } from './chargeFjsV2Client.config'

export const ApiConfiguration = {
  provide: 'ChargeFjsV2ClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof ChargeFjsV2ClientConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-charge-fjs-v2',
        timeout: config.fetchTimeout,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [ChargeFjsV2ClientConfig.KEY, XRoadConfig.KEY],
}
