import { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import {
  AdminApi,
  Configuration,
  DelegationAdminApi,
  PublicApi,
} from '../../gen/fetch'
import { AuthAdminApiClientConfig } from './auth-admin-api-client.config'
import { Provider } from '@nestjs/common'

interface AdminApiEnv {
  env: Environment
  key: string
}

export const AdminDevApi: AdminApiEnv = {
  env: Environment.Development,
  key: 'AdminDevApi',
}
export const AdminStagingApi: AdminApiEnv = {
  env: Environment.Staging,
  key: 'AdminStagingApi',
}
export const AdminProdApi: AdminApiEnv = {
  env: Environment.Production,
  key: 'AdminProdApi',
}

export const PublicDevApi: AdminApiEnv = {
  env: Environment.Development,
  key: 'PublicDevApi',
}
export const PublicStagingApi: AdminApiEnv = {
  env: Environment.Staging,
  key: 'PublicStagingApi',
}
export const PublicProdApi: AdminApiEnv = {
  env: Environment.Production,
  key: 'PublicProdApi',
}

export const CurrentPublicApi = 'CurrentPublicApi'

export const exportedApis: Provider[] = [
  AdminDevApi,
  AdminStagingApi,
  AdminProdApi,
].map((adminApi) => {
  return {
    provide: adminApi.key,
    useFactory: (config: ConfigType<typeof AuthAdminApiClientConfig>) =>
      config.basePaths[adminApi.env]
        ? new AdminApi(
            new Configuration({
              fetchApi: createEnhancedFetch({
                name: `clients-auth-admin-${adminApi.env}-api`,
              }),
              basePath: config.basePaths[adminApi.env],
            }),
          )
        : undefined,
    inject: [AuthAdminApiClientConfig.KEY],
  }
})

exportedApis.push(
  ...[PublicDevApi, PublicStagingApi, PublicProdApi].map((publicApi) => ({
    provide: publicApi.key,
    useFactory: (config: ConfigType<typeof AuthAdminApiClientConfig>) =>
      config.basePaths[publicApi.env]
        ? new PublicApi(
            new Configuration({
              fetchApi: createEnhancedFetch({
                name: `clients-auth-public-${publicApi.env}-api`,
              }),
              basePath: config.basePaths[publicApi.env],
            }),
          )
        : undefined,
    inject: [AuthAdminApiClientConfig.KEY],
  })),
)

exportedApis.push({
  provide: CurrentPublicApi,
  inject: [AuthAdminApiClientConfig.KEY],
  useFactory: (config: ConfigType<typeof AuthAdminApiClientConfig>) =>
    new PublicApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-auth-public-current-api',
        }),
        basePath: config.basePath,
      }),
    ),
})

exportedApis.push({
  provide: DelegationAdminApi,
  inject: [AuthAdminApiClientConfig.KEY],
  useFactory: (config: ConfigType<typeof AuthAdminApiClientConfig>) =>
    new DelegationAdminApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-auth-delegation-admin-api',
        }),
        basePath: config.basePath,
      }),
    ),
})
