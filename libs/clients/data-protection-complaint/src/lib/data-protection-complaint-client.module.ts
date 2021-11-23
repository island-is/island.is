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

export class ClientsDataProtectionComplaintModule {
  static register(config: DataProtectionComplaintClientConfig): DynamicModule {
    const providerConfiguration = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'data-protection-complaint-client',
      }),
      basePath: useXroad ? config.xRoadPath : undefined,
    })

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
        {
          provide: SecurityApi,
          useFactory: () => {
            return new SecurityApi(providerConfiguration)
          },
        },
        TokenMiddleware,
        ...exportedApis.map((Api) => ({
          inject: [TokenMiddleware],
          provide: Api,
          useFactory: () => new Api(providerConfiguration),
        })),
      ],
      exports: exportedApis,
    }
    /* return {
      module: ClientsDataProtectionComplaintModule,
      providers: [
        {
          provide: CLIENT_CONFIG,
          useFactory: () => dataProtectionComplaintClientConfig,
        },
        TokenMiddleware,
        {
          provide: SecurityApi,
          useFactory: () => {
            return new SecurityApi(
              new Configuration({
                fetchApi: fetch,
              }),
            )
          },
        },
        apiWithMiddlewareFactory(CaseApi),
        apiWithMiddlewareFactory(ClientsApi),
        apiWithMiddlewareFactory(DocumentApi),
        apiWithMiddlewareFactory(MemoApi),
      ],
      exports: [DocumentApi, CaseApi, SecurityApi, MemoApi, ClientsApi],
    }*/
  }
}
