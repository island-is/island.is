import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'

import { BlikkClientConfig } from './blikkClient.config'

export const BlikkFetch = 'BlikkEnhancedFetch'

export const enhancedFetch = {
  provide: BlikkFetch,
  useFactory: (config: ConfigType<typeof BlikkClientConfig>) =>
    createEnhancedFetch({
      name: 'clients-blikk',
      timeout: config.fetchTimeout,
      // Blikk error bodies can carry payment detail — don't log them.
      logErrorResponseBody: false,
    }),
  inject: [BlikkClientConfig.KEY],
}
