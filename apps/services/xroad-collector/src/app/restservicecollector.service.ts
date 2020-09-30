import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Injectable } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { Provider, Service } from '@island.is/api-catalogue/types'

@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private readonly providerService: ProviderService,
    private readonly elasticService: ElasticService,
  ) {}

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services...')
    const protectedProviders = await this.providerService.getProtectedProviders()
    logger.debug(`Found ${protectedProviders.length} protected clients...`)

    protectedProviders.forEach(async (provider: Provider) => {
      // Get list af all REST service codes for this provider

      // Group all service codes that have same first section
      // given that service code is: <service id>-v<service version>

      // Insert into Elastic

      let service: Service = {
        id: `${provider.xroadInstance}/${provider.memberClass}/${provider.memberCode}/${provider.subsystemCode}`,
      }
    })
  }
}
