import { DynamicModule, HttpModule } from '@nestjs/common'

import { Configuration, OrganisationsApi, ProvidersApi } from '../../gen/fetch'

import {
  DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD,
  DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST,
  DocumentProviderConfig,
} from './client/documentProviderClientConfig'
import { DocumentProviderClientProd } from './client/documentProviderClientProd'
import { DocumentProviderClientTest } from './client/documentProviderClientTest'
import { DocumentProviderResolver } from './document-provider.resolver'
import { DocumentProviderService } from './document-provider.service'

export interface Config extends DocumentProviderConfig {
  documentsServiceBasePath: string
  documentProviderAdmins: string
}

export class DocumentProviderModule {
  static register(config: Config): DynamicModule {
    return {
      module: DocumentProviderModule,
      imports: [
        HttpModule.register({
          timeout: 10000,
        }),
      ],
      providers: [
        DocumentProviderResolver,
        DocumentProviderService,
        DocumentProviderClientTest,
        {
          provide: DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST,
          useValue: config.test,
        },
        DocumentProviderClientProd,
        {
          provide: DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD,
          useValue: config.prod,
        },
        {
          provide: OrganisationsApi,
          useFactory: () =>
            new OrganisationsApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.documentsServiceBasePath,
              }),
            ),
        },
        {
          provide: ProvidersApi,
          useFactory: () =>
            new ProvidersApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.documentsServiceBasePath,
              }),
            ),
        },
      ],
    }
  }
}
