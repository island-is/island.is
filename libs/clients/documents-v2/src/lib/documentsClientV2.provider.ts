import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'

import { Configuration, CustomersApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { DocumentsClientV2Config } from './documentsClientV2.config'

export const DocumentsClientV2Provider: Provider<CustomersApi> = {
  provide: CustomersApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof DocumentsClientV2Config>) =>
    new CustomersApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-documents-v2',
          autoAuth: {
            mode: 'token',
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            scope: [config.scope],
            issuer: '',
            tokenEndpoint: config.tokenUrl,
          },
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [DocumentsClientV2Config.KEY],
}

export class DocumentListApi extends CustomersApi {}

export const DocumentsClientListV2Provider: Provider<DocumentListApi> = {
  provide: DocumentListApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof DocumentsClientV2Config>) =>
    new CustomersApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-documents-list-v2',
          autoAuth: {
            mode: 'token',
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            scope: [config.scope],
            issuer: '',
            tokenEndpoint: config.tokenUrl,
          },
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [DocumentsClientV2Config.KEY],
}
