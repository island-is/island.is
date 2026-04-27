import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { createEnhancedFetch } from '@island.is/clients/middlewares'

import { client } from '../../gen/fetch/client.gen'
import { LyfjastofnunPharmaciesClientConfig } from './lyfjastofnun-pharmacies.config'
import { LyfjastofnunPharmaciesClientService } from './lyfjastofnun-pharmacies.service'

@Module({
  providers: [LyfjastofnunPharmaciesClientService],
  exports: [LyfjastofnunPharmaciesClientService],
})
export class LyfjastofnunPharmaciesClientModule {
  constructor(
    @Inject(LyfjastofnunPharmaciesClientConfig.KEY)
    config: ConfigType<typeof LyfjastofnunPharmaciesClientConfig>,
  ) {
    client.setConfig({
      baseUrl: config.basePath,
      headers: {
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-lyfjastofnun-pharmacies',
        organizationSlug: 'lyfjastofnun',
      }),
    })
  }
}
