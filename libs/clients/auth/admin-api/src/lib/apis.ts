import { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import { AdminApi, Configuration, DelegationAdminApi } from '../../gen/fetch'
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
