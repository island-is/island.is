import { Inject, Module } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'

import { createEnhancedFetch } from '@island.is/clients/middlewares'

import { client } from '../../gen/fetch/client.gen'
import { MatildaClientConfig } from './matilda.config'
import { MatildaClientService } from './matilda.service'

@Module({
  providers: [MatildaClientService],
  exports: [MatildaClientService],
})
export class MatildaClientModule {
  constructor(
    @Inject(MatildaClientConfig.KEY)
    config: ConfigType<typeof MatildaClientConfig>,
  ) {
    client.setConfig({
      baseUrl: config.baseUrl,
      headers: {
        Accept: 'application/json',
        'x-api-key': config.apiKey,
      },
      fetch: createEnhancedFetch({
        name: 'clients-matilda',
        organizationSlug: 'landspitali',
      }),
    })
  }
}
