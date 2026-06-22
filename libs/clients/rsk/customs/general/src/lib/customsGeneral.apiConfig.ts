import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { client } from '../../gen/fetch/client.gen'
import { CustomsGeneralClientConfig } from './customsGeneral.config'

export const CUSTOMS_GENERAL_CLIENT = 'CUSTOMS_GENERAL_CLIENT'

export const CustomsGeneralApiConfig = {
  provide: CUSTOMS_GENERAL_CLIENT,
  useFactory: (config: ConfigType<typeof CustomsGeneralClientConfig>) => {
    const authorization = `Basic ${Buffer.from(
      `${config.username}:${config.password}`,
    ).toString('base64')}`

    client.setConfig({
      baseUrl: config.baseUrl,
      headers: {
        Accept: 'application/json',
        Authorization: authorization,
        'X-Gateway-APIKey': config.apiKey,
      },
      fetch: createEnhancedFetch({
        name: 'clients-customs-general',
      }),
    })

    return client
  },
  inject: [CustomsGeneralClientConfig.KEY],
}
