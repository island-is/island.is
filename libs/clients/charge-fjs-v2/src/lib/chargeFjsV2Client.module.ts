import { Module } from '@nestjs/common'

import { IdsClientConfig } from '@island.is/nest/config'

import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { ChargeFjsV2ClientService } from './chargeFjsV2Client.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfiguration, ChargeFjsV2ClientService, ...exportedApis],
  exports: [ChargeFjsV2ClientService, ...exportedApis],
})
export class ChargeFjsV2ClientModule {}

// import { DynamicModule } from '@nestjs/common'
// import {
//   createEnhancedFetch,
//   EnhancedFetchOptions,
// } from '@island.is/clients/middlewares'
// import { ChargeFjsV2Api } from './chargeFjsV2Client.service'
// import { DefaultApi, Configuration } from '../../gen/fetch'

// export interface ChargeFjsV2ApiConfig {
//   xroadBaseUrl: string
//   xroadClientId: string
//   xroadPath: string
//   fetchOptions?: Partial<EnhancedFetchOptions>
// }

// //TODOx sjá libs\clients\assets\src\lib\PropertiesApiProvider.ts
// const configFactory = (config: ChargeFjsV2ApiConfig, basePath: string) => ({
//   fetchApi: createEnhancedFetch({
//     name: 'clients-charge-fjs-v2',
//     ...config.fetchOptions,
//   }),
//   headers: {
//     'X-Road-Client': config.xroadClientId,
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
//   basePath,
// })

// export class ChargeFjsV2ApiModule {
//   static register(config: ChargeFjsV2ApiConfig): DynamicModule {
//     return {
//       module: ChargeFjsV2ApiModule,
//       providers: [
//         {
//           provide: ChargeFjsV2Api,
//           useFactory: () => {
//             const api = new DefaultApi(
//               new Configuration(
//                 configFactory(
//                   config,
//                   `${config.xroadBaseUrl}/${config.xroadPath}`,
//                 ),
//               ),
//             )

//             return new ChargeFjsV2Api(api)
//           },
//         },
//       ],
//       exports: [ChargeFjsV2Api],
//     }
//   }
// }
