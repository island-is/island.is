import { Inject, Module } from '@nestjs/common'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import type { ConfigType } from '@island.is/nest/config'

import { client } from '../../gen/fetch/client.gen'
import { ReiknivelarClientConfig } from './reiknivelar.config'
import { ReiknivelarClientService } from './reiknivelar.service'

@Module({
  imports: [ReiknivelarClientConfig.registerOptional()],
  providers: [ReiknivelarClientService],
  exports: [ReiknivelarClientService],
})
export class ReiknivelarClientModule {
  constructor(
    @Inject(ReiknivelarClientConfig.KEY)
    config: ConfigType<typeof ReiknivelarClientConfig>,
  ) {
    client.setConfig({
      baseUrl: config.baseUrl,
      headers: {
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-rsk-reiknivelar',
        organizationSlug: 'skatturinn',
        timeout: 20000,
      }),
    })
  }
}
