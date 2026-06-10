import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { CustomsCalculatorClientConfig } from './customsCalculatorClient.config'

export const CustomsCalculatorApiConfiguration = {
  provide: Configuration,
  useFactory: (config: ConfigType<typeof CustomsCalculatorClientConfig>) => {
    const authorization = `Basic ${Buffer.from(
      `${config.username}:${config.password}`,
    ).toString('base64')}`

    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-customs-calculator',
        organizationSlug: 'skatturinn',
        timeout: 20000,
      }),
      basePath: config.basePath,
      headers: {
        Authorization: authorization,
        'X-Gateway-APIKey': config.apiKey,
      },
    })
  },
  inject: [CustomsCalculatorClientConfig.KEY],
}
