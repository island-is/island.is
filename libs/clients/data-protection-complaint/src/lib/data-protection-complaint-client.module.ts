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
import { TokenMiddleware } from './data-protection-complaint-client.middleware'

const apiWithMiddlewareFactory = <T extends BaseAPI>(
  api: new (config: Configuration) => T,
) => {
  return {
    provide: api,
    inject: [TokenMiddleware],
    useFactory: (middleware: TokenMiddleware) => {
      return new api(
        new Configuration({
          fetchApi: fetch,
          middleware: [middleware],
        }),
      )
    },
  }
}

export class ClientsDataProtectionComplaintModule {
  static register(
    dataProtectionComplaintClientConfig: DataProtectionComplaintClientConfig,
  ): DynamicModule {
    return {
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
    }
  }
}
