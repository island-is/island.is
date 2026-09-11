import { Inject, Module } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { client } from '../../gen/fetch/client.gen'
import { CalculatorsClientConfig } from './calculators.config'
import { CalculatorsClientService } from './calculators.service'

@Module({
  imports: [CalculatorsClientConfig.registerOptional()],
  providers: [CalculatorsClientService],
  exports: [CalculatorsClientService],
})
export class CalculatorsClientModule {
  constructor(
    @Inject(CalculatorsClientConfig.KEY)
    config: ConfigType<typeof CalculatorsClientConfig>,
  ) {
    client.setConfig({
      baseUrl: config.baseUrl,
      headers: {
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-rsk-calculators',
        organizationSlug: 'skatturinn',
        timeout: 20000,
      }),
    })
  }
}
