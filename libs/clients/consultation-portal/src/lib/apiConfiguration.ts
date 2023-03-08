import {
  CasesApi,
  Configuration,
  DocumentsApi,
  TypesApi,
} from '../../gen/fetch'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { ConsultationPortalClientConfig } from './consultationPortalClient.config'
import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
): Provider<T> => ({
  provide: Api,
  useFactory: (config: ConfigType<typeof ConsultationPortalClientConfig>) =>
    new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'consultation-portal',
          logErrorResponseBody: true,
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [ConsultationPortalClientConfig.KEY],
})

export const CasesApiProvider = provideApi(CasesApi)
export const DocumentsApiProvider = provideApi(DocumentsApi)
export const TypesApiProvider = provideApi(TypesApi)
