import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { client } from '../../gen/fetch/client.gen'
import { CustomsCalculatorClientConfig } from './customsCalculatorClient.config'

export const CUSTOMS_CALCULATOR_CLIENT = 'CUSTOMS_CALCULATOR_CLIENT'

export const CustomsCalculatorApiConfig = {
  provide: CUSTOMS_CALCULATOR_CLIENT,
  useFactory: (config: ConfigType<typeof CustomsCalculatorClientConfig>) => {
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
        name: 'clients-rsk-customs-calculator',
        organizationSlug: 'skatturinn',
        timeout: 20000,
      }),
    })

    return client
  },
  inject: [CustomsCalculatorClientConfig.KEY],
}
