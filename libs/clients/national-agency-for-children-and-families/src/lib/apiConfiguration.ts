import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { NationalAgencyForChildrenAndFamiliesClientConfig } from './nationalAgencyForChildrenAndFamiliesClient.config'

export const ApiConfiguration = {
  provide: 'NationalAgencyForChildrenAndFamiliesApiConfiguration',
  scope: LazyDuringDevScope,
  useFactory: (
    config: ConfigType<typeof NationalAgencyForChildrenAndFamiliesClientConfig>,
  ) =>
    new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-national-agency-for-children-and-families',
        autoAuth: {
          mode: 'token',
          issuer: config.baseUrl,
          tokenEndpoint: `${config.baseUrl}/auth/connect/token`,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: config.scope,
        },
      }),
      basePath: config.baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),
  inject: [NationalAgencyForChildrenAndFamiliesClientConfig.KEY],
}
