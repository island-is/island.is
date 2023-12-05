import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'

import { Configuration, CustomersApi } from '../../gen/fetch'
import { DocumentsV2ClientConfig } from './documentsV2Client.config'
import { Provider } from '@nestjs/common'

export const CustomersApiProvider: Provider<CustomersApi> = {
  provide: CustomersApi,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof DocumentsV2ClientConfig>) =>
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
  inject: [DocumentsV2ClientConfig.KEY],
}
