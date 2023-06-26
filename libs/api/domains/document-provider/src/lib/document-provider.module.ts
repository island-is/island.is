import { DynamicModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { Configuration, OrganisationsApi, ProvidersApi } from '../../gen/fetch'
import { DocumentProviderResolver } from './document-provider/document-provider.resolver'
import { DocumentProviderService } from './document-provider/document-provider.service'
import { DocumentProviderClientProd } from './client/documentProviderClientProd'
import {
  DocumentProviderConfig,
  DOCUMENT_PROVIDER_CLIENT_CONFIG_PROD,
  DOCUMENT_PROVIDER_CLIENT_CONFIG_TEST,
} from './client/documentProviderClientConfig'
import { DocumentProviderClientTest } from './client/documentProviderClientTest'
import { AdminDocumentProviderService } from './admin/admin-document-provider.service'
import { AdminDocumentProviderResolver } from './admin/admin-document.provider.resolver'

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
        AdminDocumentProviderService,
        AdminDocumentProviderResolver,
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
