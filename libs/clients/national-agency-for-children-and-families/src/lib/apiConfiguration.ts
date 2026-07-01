import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { NationalAgencyForChildrenAndFamiliesClientConfig } from './nationalAgencyForChildrenAndFamiliesClient.config'

const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

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
          tokenRequestHeaders: { 'user-agent': BROWSER_USER_AGENT },
        },
      }),
      basePath: config.baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': BROWSER_USER_AGENT,
      },
    }),
  inject: [NationalAgencyForChildrenAndFamiliesClientConfig.KEY],
}
