import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { createEnhancedFetch } from '@island.is/clients/middlewares'

import { client } from '../../gen/fetch/client.gen'
import { LyfjastofnunHealthProvidersClientConfig } from './lyfjastofnun-health-providers.config'
import { LyfjastofnunHealthProvidersClientService } from './lyfjastofnun-health-providers.service'

@Module({
  providers: [LyfjastofnunHealthProvidersClientService],
  exports: [LyfjastofnunHealthProvidersClientService],
})
export class LyfjastofnunHealthProvidersClientModule {
  constructor(
    @Inject(LyfjastofnunHealthProvidersClientConfig.KEY)
    config: ConfigType<typeof LyfjastofnunHealthProvidersClientConfig>,
  ) {
    client.setConfig({
      baseUrl: config.basePath,
      headers: {
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-lyfjastofnun-health-providers',
        organizationSlug: 'lyfjastofnun',
      }),
    })
  }
}
