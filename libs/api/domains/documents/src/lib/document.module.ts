import { DynamicModule, Module, Scope } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { CustomersApi, Configuration } from '../../gen/fetch'
import { DocumentOauthConnection } from './document.connection'

export interface Config {
  basePath: string
  clientId: string
  clientSecret: string
  tokenUrl: string
}

export class DocumentModule {
  static register(config: Config): DynamicModule {
    return {
      module: DocumentModule,
      providers: [
        DocumentResolver,
        DocumentService,
        {
          provide: CustomersApi,
          useFactory: async () =>
            new CustomersApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.basePath,
                headers: {
                  Authorization: `Bearer ${await DocumentOauthConnection.fetchToken(
                    config.clientId,
                    config.clientSecret,
                    config.tokenUrl,
                    config.basePath,
                  )}`,
                },
              }),
            ),
          scope: Scope.REQUEST,
        },
      ],
    }
  }
}
