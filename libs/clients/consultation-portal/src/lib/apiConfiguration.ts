import { CasesApi, Configuration, DocumentsApi } from '../../gen/fetch'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

import { ConsultationPortalClientConfig } from './consultationPortalClient.config'
import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { ConfigType } from '@nestjs/config'
import { createRedisCluster } from '../../../../cache/src'
import { createEnhancedFetch } from '../../../middlewares/src'

const provideApi = <T>(
  Api: new (configuration: Configuration) => T,
  scope?: string[],
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
