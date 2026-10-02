import { Inject, Module } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { client } from '../../gen/fetch/client.gen'
import { BlikkClientConfig } from './blikkClient.config'
import { BlikkClientService } from './blikkClient.service'

@Module({
  providers: [BlikkClientService],
  exports: [BlikkClientService],
})
export class BlikkClientModule {
  constructor(
    @Inject(BlikkClientConfig.KEY)
    config: ConfigType<typeof BlikkClientConfig>,
  ) {
    client.setConfig({
      // The OpenAPI document's paths are relative to the e-commerce API root.
      baseUrl: `${config.basePath}/ecom`,
      headers: {
        Accept: 'application/json',
        'API-Key': config.apiKey,
      },
      fetch: createEnhancedFetch({
        name: 'clients-blikk',
        timeout: config.fetchTimeout,
        // Error bodies are logged (the default). Blikk only ever sees national ids and bank account
        // numbers, which our logging redacts / does not treat as sensitive — no names are sent.
      }),
    })
  }
}
