import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { FinancialManagementAuthorityClientConfig } from './financialManagementAuthorityClient.config'

export const apiConfigFactory = (
  scopes: Array<string>,
  config: ConfigType<typeof FinancialManagementAuthorityClientConfig>,
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
        issuer: config.authUrl,
      },
    }),
    basePath: config.basePath,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ExecuteAsUsername': config.executeAsUsername,
    },
  })
}
