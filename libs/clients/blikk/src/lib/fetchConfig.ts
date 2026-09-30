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
      // Error bodies are logged (the default). Blikk only ever sees national ids and bank account
      // numbers, which our logging redacts / does not treat as sensitive — no names are sent.
    }),
  inject: [BlikkClientConfig.KEY],
}
