import { DynamicModule } from '@nestjs/common'
import { Configuration, OrganisationsApi } from '../../gen/fetch'

export interface DocumentProviderModuleConfig {
  basePath: string
}

export class ClientsDocumentProviderModule {
  static register(config: DocumentProviderModuleConfig): DynamicModule {
    return {
      module: ClientsDocumentProviderModule,
      providers: [
        {
          provide: OrganisationsApi,
          useFactory: () =>
            new OrganisationsApi(
              new Configuration({
                fetchApi: fetch,
                basePath: config.basePath,
              }),
            ),
        },
      ],
      exports: [OrganisationsApi],
    }
  }
}
