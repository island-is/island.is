import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Injectable } from '@nestjs/common'
import { ProviderService } from './provider.service'
import { ServiceCollector } from './servicecollector.interface'
import { logger } from '@island.is/logging'
import { Provider, Service } from '@island.is/api-catalogue/types'
import { RestMetadataService } from './restmetadata.service'

@Injectable()
export class RestServiceCollector implements ServiceCollector {
  constructor(
    private readonly providerService: ProviderService,
    private readonly restMetadataService: RestMetadataService,
    private readonly elasticService: ElasticService,
  ) {}

  async indexServices(): Promise<void> {
    logger.info('Start indexing of REST services...')
    const protectedProviders = await this.providerService.getProtectedProviders()
    logger.debug(`Found ${protectedProviders.length} protected clients...`)

    protectedProviders.forEach(async (provider: Provider) => {
      // Get list af all REST service that have OpenAPI
      let services = await this.restMetadataService.getServices(provider)

      // Insert into Elastic
    })
  }
}
