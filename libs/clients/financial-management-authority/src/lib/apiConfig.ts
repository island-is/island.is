import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { FinancialManagementAuthorityClientConfig } from './financialManagementAuthorityClient.config'

export const apiConfigFactory = (
  scopes: Array<string>,
  config: ConfigType<typeof FinancialManagementAuthorityClientConfig>,
  idsClientConfig: ConfigType<typeof IdsClientConfig>,
) => {
  return new Configuration({
    fetchApi: createEnhancedFetch({
      name: 'clients-financial-management-authority',
      organizationSlug: 'fjarsysla-rikisins',
      autoAuth: {
        mode: 'token',
        clientId: config.clientId.trim(),
        clientSecret: config.clientSecret.trim(),
        scope: scopes,
        issuer: idsClientConfig.issuer,
      },
    }),
    basePath: config.basePath,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
}
