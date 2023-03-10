import {
  Configuration,
  DraftAuthorApi,
  DraftRegulationCancelApi,
  DraftRegulationChangeApi,
  DraftRegulationsApi,
  InternalApi,
} from '../../gen/fetch'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { RegulationsAdminClientConfig } from './RegulationsAdminClientConfig'
import { ConfigType } from '@nestjs/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
): Provider<T> => ({
  provide: Api,
  useFactory: (config: ConfigType<typeof RegulationsAdminClientConfig>) => {
    return new Api(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'Regulations-AdminClientService',
          logErrorResponseBody: true,
        }),
        basePath: config.baseApiUrl,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )
  },
  inject: [RegulationsAdminClientConfig.KEY],
})

export const DraftAuthorApiProvider = provideApi(DraftAuthorApi)
export const DraftRegulationCancelApiProvider = provideApi(
  DraftRegulationCancelApi,
)
export const DraftRegulationChangeApiProvider = provideApi(
  DraftRegulationChangeApi,
)
export const DraftRegulationsApiProvider = provideApi(DraftRegulationsApi)
export const InternalApiProvider = provideApi(InternalApi)
