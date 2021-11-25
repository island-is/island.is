import { DynamicModule } from '@nestjs/common'
import {
  BaseAPI,
  CaseApi,
  ClientsApi,
  Configuration,
  DocumentApi,
  MemoApi,
  SecurityApi,
} from '../gen/fetch/dev'
import {
  CLIENT_CONFIG,
  DataProtectionComplaintClientConfig,
} from './data-protection-complaint-client.config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { TokenMiddleware } from './data-protection-complaint-client.middleware'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

const useXroad =
  isRunningOnEnvironment('production') || isRunningOnEnvironment('staging')

const createProviderConfig = (
  config: DataProtectionComplaintClientConfig,
  middleware?: TokenMiddleware,
): Configuration => {
  return new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'data-protection-complaint-client',
    }),
    basePath: useXroad ? config.xRoadPath : undefined,
    middleware: middleware ? [middleware] : [],
  })
}

export class ClientsDataProtectionComplaintModule {
  static register(config: DataProtectionComplaintClientConfig): DynamicModule {
    const exportedApis = [
      DocumentApi,
      CaseApi,
      SecurityApi,
      MemoApi,
      ClientsApi,
    ]
    console.log('hehehe123123')
    return {
      module: ClientsDataProtectionComplaintModule,
      providers: [
        {
          provide: CLIENT_CONFIG,
          useFactory: () => config,
        },
        TokenMiddleware,
        {
          provide: SecurityApi,
          useFactory: () => {
            return new SecurityApi(createProviderConfig(config))
          },
        },
        ...exportedApis.map((Api) => ({
          provide: Api,
          inject: [TokenMiddleware],
          useFactory: (middleware: TokenMiddleware) => {
            return new Api(createProviderConfig(config, middleware))
          },
        })),
      ],
      exports: exportedApis,
    }
  }
}
