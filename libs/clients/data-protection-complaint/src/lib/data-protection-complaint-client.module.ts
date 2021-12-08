import { DynamicModule, Provider } from '@nestjs/common'
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
import { logger } from '@island.is/logging'
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
    if (!config.xRoadPath) {
      logger.error('DataProtectionClient xRoadPath not provided.')
    }
    if (!config.password) {
      logger.error('DataProtectionClient password not provided.')
    }
    if (!config.username) {
      logger.error('DataProtectionClient username not provided.')
    }

    const exportedApis = [
      DocumentApi,
      CaseApi,
      SecurityApi,
      MemoApi,
      ClientsApi,
    ]

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
          useFactory: () => {
            return new Api(
              new Configuration({
                fetchApi: createEnhancedFetch({
                  name: 'data-protection-complaint-client',
                }),
                basePath: useXroad ? config.xRoadPath : undefined,
              }),
            )
          },
        })),
      ],
      exports: [...exportedApis, TokenMiddleware],
    }
  }
}
