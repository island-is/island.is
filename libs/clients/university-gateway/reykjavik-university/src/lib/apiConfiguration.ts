import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  ConfigType,
  // XRoadConfig,
  // IdsClientConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { UgReykjavikUniversityClientConfig } from './ugReykjavikUniversityClient.config'

//TODOx update configuration so it works for xroad (when xroad is ready)
export const ApiConfiguration = {
  provide: 'UgReykjavikUniversityClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof UgReykjavikUniversityClientConfig>,
    // xroadConfig: ConfigType<typeof XRoadConfig>,
    // idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-university-gateway-reykjavik-university',
        timeout: config.fetch.timeout,
        // autoAuth: idsClientConfig.isConfigured
        //   ? {
        //       mode: 'auto',
        //       issuer: idsClientConfig.issuer,
        //       clientId: idsClientConfig.clientId,
        //       clientSecret: idsClientConfig.clientSecret,
        //       scope: config.tokenExchangeScope,
        //       tokenExchange: {
        //         requestActorToken: config.requestActorToken,
        //       },
        //     }
        //   : undefined,
      }),
      // basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      basePath: config.url,
      headers: {
        // 'X-Road-Client': xroadConfig.xRoadClient,
        ClientId: config.clientId,
        Secret: config.secret,
      },
    })
  },
  inject: [
    UgReykjavikUniversityClientConfig.KEY,
    // XRoadConfig.KEY,
    // IdsClientConfig.KEY,
  ],
}
