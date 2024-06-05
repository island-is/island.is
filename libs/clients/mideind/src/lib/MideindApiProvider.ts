// import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
// import { createEnhancedFetch } from '@island.is/clients/middlewares'
// import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
// import { MideindClientConfig } from './MideindClient.config'

// const provideApi = <T>(
//   Api: new (configuration: Configuration) => T
// ): Provider<T> => ({
//   provide: Api,
//   scope: LazyDuringDevScope,
//   useFactory: (config: ConfigType<typeof MideindClientConfig>) =>
//     new Api(
//       new Configuration({
//         fetchApi: createEnhancedFetch({
//           name: 'mideind',
//           organizationSlug: 'stafraent-island',
//           logErrorResponseBody: true
//         }),
//         basePath: config.basePath,
//         headers: {
//           Accept: 'application/json'
//         }
//       })
//     ),
//   inject: [MideindClientConfig.KEY]
// })
