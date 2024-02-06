import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'

import { Configuration, CustomersApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common'
import { DocumentsClientConfig } from './documentsClient.config'

export const DocumentsClientProvider: Provider<CustomersApi> = {
  provide: CustomersApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof DocumentsClientConfig>) =>
    new CustomersApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-documents',
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
  inject: [DocumentsClientConfig.KEY],
}
