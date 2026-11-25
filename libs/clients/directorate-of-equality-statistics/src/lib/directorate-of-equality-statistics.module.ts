import { Inject, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { client } from '../../gen/fetch/client.gen'
import { DirectorateOfEqualityStatisticsClientConfig } from './directorate-of-equality-statistics.config'
import { DirectorateOfEqualityStatisticsClientService } from './directorate-of-equality-statistics.service'

@Module({
  providers: [DirectorateOfEqualityStatisticsClientService],
  exports: [DirectorateOfEqualityStatisticsClientService],
})
export class DirectorateOfEqualityStatisticsClientModule {
  constructor(
    @Inject(XRoadConfig.KEY)
    xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(DirectorateOfEqualityStatisticsClientConfig.KEY)
    config: ConfigType<typeof DirectorateOfEqualityStatisticsClientConfig>,
  ) {
    // No citizen auth: the statistics are aggregate and served without a token.
    client.setConfig({
      baseUrl: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xroadConfig.xRoadClient,
        Accept: 'application/json',
      },
      fetch: createEnhancedFetch({
        name: 'clients-directorate-of-equality-statistics',
        organizationSlug: 'domsmalaraduneytid',
      }),
    })
  }
}
