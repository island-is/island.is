import {
  CasesApi,
  CaseSubscriptionApi,
  Configuration,
  DocumentsApi,
  StatisticsApi,
  TypesApi,
  UserApi,
} from '../../gen/fetch'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { ConsultationPortalClientConfig } from './consultationPortalClient.config'
import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { IdsClientConfig } from '@island.is/nest/config'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
): Provider<T> => ({
  provide: Api,
  useFactory: (
    config: ConfigType<typeof ConsultationPortalClientConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) =>
    new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'consultation-portal',
          organizationSlug: 'stjornarrad-islands',
          logErrorResponseBody: true,
          autoAuth: idsClientConfig.isConfigured
            ? {
                mode: 'auto',
                issuer: idsClientConfig.issuer,
                clientId: idsClientConfig.clientId,
                clientSecret: idsClientConfig.clientSecret,
                scope: config.tokenExchangeScope,
              }
            : undefined,
        }),
        basePath: config.basePath,
        headers: {
          Accept: 'application/json',
        },
      }),
    ),
  inject: [ConsultationPortalClientConfig.KEY, IdsClientConfig.KEY],
})

export const CasesApiProvider = provideApi(CasesApi)
export const CaseSubscriptionApiProvider = provideApi(CaseSubscriptionApi)
export const DocumentsApiProvider = provideApi(DocumentsApi)
export const StatisticsApiProvider = provideApi(StatisticsApi)
export const TypesApiProvider = provideApi(TypesApi)
export const UserApiProvider = provideApi(UserApi)
